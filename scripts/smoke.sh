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

# --bare drops the todo example, so the guarded route doesn't exist
case "$FLAGS" in *--bare*) TODOS=no ;; *) TODOS=yes ;; esac
# DI-only runs Nest inside Next: no api process, so /api is served on the web port
case "$FLAGS" in *--nest-di-only*) DI_ONLY=yes ;; *) DI_ONLY=no ;; esac

echo "smoke: mode=$MODE di-only=$DI_ONLY flags=${FLAGS:-none}"

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

wait_for() { # url, log-name
  for _ in $(seq 1 90); do
    curl -sf -o /dev/null "$1" && return 0
    sleep 1
  done
  fail "nothing served $1 within 90s" "$2"
}

probe() { # description, url, expected-status
  local got
  got=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$2")
  if [ "$got" != "$3" ]; then
    fail "$1: expected $3 from $2, got $got"
  fi
  echo "  ok  [$got] $1"
}

WEB=http://localhost:3000

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
  else
    start api pnpm --filter api start:prod
    BASE=http://localhost:3001
  fi
fi

wait_for "$BASE/api/hello" "$([ "$BASE" = "$WEB" ] && echo web || echo api)"
wait_for "$WEB/" web

probe "web serves the app"        "$WEB/"                       200
probe "api route"                 "$BASE/api/hello"             200
probe "auth is mounted"           "$BASE/api/auth/get-session"  200
# an unmatched /api path must 404 from the router, not 500 out of middleware
probe "unknown api route 404s"    "$BASE/api/__nope__"          404
[ "$TODOS" = yes ] && probe "auth guard rejects anonymous" "$BASE/api/todos" 401

body=$(curl -sf "$BASE/api/hello")
echo "$body" | grep -q "Hello from Nest" || fail "unexpected /api/hello body: $body"
echo "  ok  /api/hello body: $body"

# The standalone Dockerfile copies build artifacts by path; if a template stops
# producing one (e.g. output: "standalone" gets overwritten) the image build
# breaks, which no amount of probing a locally-started app would reveal.
if [ "$MODE" = standalone ] && [ -f Dockerfile ]; then
  grep -oE 'COPY --from=build [^ ]+' Dockerfile | awk '{print $3}' | while read -r src; do
    case "$src" in /app/*) ;; *) continue ;; esac
    [ -e "${src#/app/}" ] || fail "Dockerfile copies ${src}, which the build did not produce"
    echo "  ok  Dockerfile artifact exists: ${src#/app/}"
  done
fi

echo "smoke: $MODE ok"
