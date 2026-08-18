#!/usr/bin/env bash
#
# Boot a scaffolded newt app and probe its HTTP surface.
#
#   scripts/smoke.sh "<scaffold flags>" [app-dir]
#   scripts/smoke.sh "--deployment spa" /tmp/test-app
#
# Run it against an app that has already been installed and built. Deployment
# modes differ in what to start and which port ends up serving, so the flags
# string picks the shape; everything else is probed the same way.
set -euo pipefail

FLAGS="${1:-}"
APP_DIR="${2:-$PWD}"
LOG_DIR="$(mktemp -d)"
cd "$APP_DIR"

case "$FLAGS" in
  *--deployment\ spa*)          MODE=spa ;;
  *--deployment\ custom-server*) MODE=custom-server ;;
  *--deployment\ standalone*)   MODE=standalone ;;
  *)                            MODE=default ;;
esac

# The todo example is opt-in, so without it the guarded route doesn't exist
case "$FLAGS" in *--include-example*) TODOS=yes ;; *) TODOS=no ;; esac
# DI-only runs Nest inside Next: no api process, so /api is served on the web port
case "$FLAGS" in *--nest-di-only*) DI_ONLY=yes ;; *) DI_ONLY=no ;; esac
# SQLite needs no server, so the signup flow below can migrate and use a real
# database. Postgres would need one this script does not start.
case "$FLAGS" in *--database\ postgres*) DB=postgres ;; *) DB=sqlite ;; esac

echo "smoke: mode=$MODE di-only=$DI_ONLY db=$DB flags=${FLAGS:-none}"

# Processes started through pnpm pick up .env via next.config/dotenv, but the
# standalone bundle does not — in production those vars come from the container
# environment, so supply them the same way here.
if [ -f .env ]; then set -a; . ./.env; set +a; fi

pids=()
cleanup() {
  for pid in ${pids+"${pids[@]}"}; do kill "$pid" 2>/dev/null || true; done
}
trap cleanup EXIT

start() { # name, command...
  local name=$1; shift
  "$@" > "$LOG_DIR/$name.log" 2>&1 &
  pids+=($!)
}

fail() { # message, log-to-dump
  echo "::error::$1"
  [ -n "${2:-}" ] && [ -f "$LOG_DIR/$2.log" ] && cat "$LOG_DIR/$2.log"
  exit 1
}

# Readiness only: any HTTP response means the process is listening. Whether the
# response is *correct* is what probe() decides, so a bad status fails fast
# instead of spinning out this timeout.
wait_for() { # url, log-name
  for _ in $(seq 1 90); do
    curl -s -o /dev/null "$1" && return 0
    sleep 1
  done
  fail "nothing listening at $1 after 90s" "$2"
}

probe() { # description, url, expected-status
  local got
  got=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$2")
  if [ "$got" != "$3" ]; then
    fail "$1: expected $3 from $2, got $got"
  fi
  echo "  ok  [$got] $1"
}

# `pnpm build` never migrates, so the database the flow at the bottom signs up
# against has no tables yet. Kysely applies the todo migration, and the
# better-auth CLI creates the user/session/account tables.
if [ "$DB" = sqlite ]; then
  pnpm db:migrate > "$LOG_DIR/migrate.log" 2>&1 || fail "db:migrate failed" migrate
  echo "  ok  migrations applied"
fi

WEB=http://localhost:3000

# Which process serves $BASE, so a failing assertion can dump the right log.
SERVER_LOG=api

if [ "$MODE" = spa ]; then
  # NestJS serves both the static export and the api
  start api pnpm --filter api start:prod
  WEB=http://localhost:3001
  BASE=$WEB
else
  case "$MODE" in
    standalone)
      # what the Dockerfile's web stage runs, rather than `next start`
      cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/ 2>/dev/null || true
      start web node apps/web/.next/standalone/apps/web/server.js
      ;;
    *)
      # custom-server's `start` is its own server; everywhere else it is `next start`
      start web pnpm --filter web start
      ;;
  esac

  if [ "$DI_ONLY" = yes ] || [ "$MODE" = custom-server ]; then
    BASE=$WEB
    SERVER_LOG=web
  else
    start api pnpm --filter api start:prod
    BASE=http://localhost:3001
  fi
fi

# Wait once per process that has to come up; everything else is probed below,
# so a wrong response fails immediately instead of spinning out the timeout.
if [ "$BASE" = "$WEB" ]; then
  wait_for "$WEB/" web
else
  wait_for "$BASE/api/hello" api
  wait_for "$WEB/" web
fi

probe "web serves the app"        "$WEB/"                       200
probe "api route"                 "$BASE/api/hello"             200
probe "auth is mounted"           "$BASE/api/auth/get-session"  200
# an unmatched /api path must 404 from the router, not 500 out of middleware
probe "unknown api route 404s"    "$BASE/api/__nope__"          404
[ "$TODOS" = yes ] && probe "auth guard rejects anonymous" "$BASE/api/todos" 401

body=$(curl -sf "$BASE/api/hello")
echo "$body" | grep -q "Hello from Nest" || fail "unexpected /api/hello body: $body"
echo "  ok  /api/hello body: $body"

# Status codes cannot tell you that sessions broke: a dependency bump can leave
# every probe above green while sign-up stops issuing a usable cookie. So drive
# the product's actual claim over HTTP (sign up, keep the session, write a row,
# read it back), the one check that exercises better-auth, Kysely, Nest and
# Next together. Postgres needs a server this script does not start, so the
# flow is sqlite-only; the todo half additionally needs the todo example.
if [ "$DB" = sqlite ]; then
  JAR="$LOG_DIR/cookies.txt"
  EMAIL="smoke-$$@example.com"
  TITLE="smoke todo $$"

  # Leaves the response body in RESP and its status in STATUS. The jar is both
  # read and written, so the sign-up cookie carries into every later call.
  request() { # method, url, [json body]
    local out
    if [ -n "${3:-}" ]; then
      out=$(curl -s -c "$JAR" -b "$JAR" -w '\n%{http_code}' --max-time 20 \
        -X "$1" "$2" -H 'content-type: application/json' -d "$3")
    else
      out=$(curl -s -c "$JAR" -b "$JAR" -w '\n%{http_code}' --max-time 20 -X "$1" "$2")
    fi
    STATUS=${out##*$'\n'}
    RESP=${out%$'\n'*}
  }

  # A 5xx here means the server threw, and the reason is only in its log.
  expect() { # description, expected-status, substring the body must contain
    [ "$STATUS" = "$2" ] || fail "$1: expected $2, got $STATUS: $RESP" "$SERVER_LOG"
    case "$RESP" in
      *"$3"*) ;;
      *) fail "$1: body does not contain '$3': $RESP" "$SERVER_LOG" ;;
    esac
    echo "  ok  [$STATUS] $1"
  }

  request POST "$BASE/api/auth/sign-up/email" \
    "{\"email\":\"$EMAIL\",\"password\":\"smoke-password-123\",\"name\":\"Smoke\"}"
  expect "sign-up creates a user" 200 "$EMAIL"

  # The jar, not the sign-up response: proves the cookie better-auth set resolves
  # back to a session row, which is what every guarded route depends on.
  request GET "$BASE/api/auth/get-session"
  expect "the session cookie resolves to a user" 200 "$EMAIL"

  if [ "$TODOS" = yes ]; then
    request POST "$BASE/api/todos" "{\"title\":\"$TITLE\"}"
    expect "creating a todo persists it" 201 "$TITLE"

    request GET "$BASE/api/todos"
    expect "the created todo reads back" 200 "$TITLE"
  else
    echo "  --  todo flow skipped: no --include-example, so no todo example"
  fi
else
  echo "  --  signup flow skipped: --database postgres needs a server this script does not start"
fi

# The standalone Dockerfile copies build artifacts by path; if a template stops
# producing one (e.g. output: "standalone" gets overwritten) the image build
# breaks, which no amount of probing a locally-started app would reveal.
if [ "$MODE" = standalone ] && [ -f Dockerfile ]; then
  grep -oE 'COPY --from=build [^ ]+' Dockerfile | awk '{print $3}' | while read -r src; do
    case "$src" in /app/*) ;; *) continue ;; esac
    [ -e "${src#/app/}" ] || fail "Dockerfile copies ${src}, which the build did not produce"
    echo "  ok  Dockerfile artifact exists: ${src#/app/}"
  done

  # A --filter naming a package that doesn't exist fails the image build before
  # anything is copied, so the artifact check above can't see it. Package names
  # differ by mode: DI-only scopes the api as @<project>/api, plain api is "api".
  node -e '
    const { readFileSync, readdirSync, existsSync } = require("fs");
    const names = ["apps", "packages"]
      .filter(existsSync)
      .flatMap((dir) => readdirSync(dir).map((entry) => `${dir}/${entry}/package.json`))
      .filter(existsSync)
      .map((file) => JSON.parse(readFileSync(file, "utf8")).name);

    const filters = [
      ...readFileSync("Dockerfile", "utf8").matchAll(/--filter=(\S+)/g),
    ].map((match) => match[1]);

    const missing = filters.filter((filter) => !names.includes(filter));
    if (missing.length) {
      console.error(`::error::Dockerfile filters no package in this workspace: ${missing.join(", ")}`);
      console.error(`workspace packages: ${names.join(", ")}`);
      process.exit(1);
    }
    console.log(`  ok  Dockerfile filters resolve: ${filters.join(", ")}`);
  ' || exit 1
fi

echo "smoke: $MODE ok"
