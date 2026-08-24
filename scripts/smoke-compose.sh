#!/usr/bin/env bash
#
# Probe a standalone scaffold that is running as containers.
#
#   scripts/smoke-compose.sh [app-dir]
#
# Expects `docker compose up -d --build` to have already run in that directory,
# against a scaffold created with:
#
#   --deployment standalone --database postgres --include-example
#
# scripts/smoke.sh boots the same build in place, on the host, where workspace
# packages resolve through the repo's own symlinks and nothing in the Dockerfile
# or the compose file is ever executed. This script probes the images and the
# compose network instead, which is the shape standalone actually ships in.
set -euo pipefail

APP_DIR="${1:-$PWD}"
cd "$APP_DIR"

WEB=http://localhost:3000
API=http://localhost:3001

echo "smoke-compose: probing the stack in $APP_DIR"

fail() { # message, [services whose logs explain it]
  local message=$1
  shift
  echo "::error::$message"
  echo "--- docker compose ps ---"
  docker compose ps -a || true
  for service in "$@"; do
    echo "--- docker compose logs $service ---"
    docker compose logs --tail 200 "$service" || true
  done
  exit 1
}

state_of() { # service
  docker compose ps -a --format '{{.Service}} {{.State}}' | awk -v s="$1" '$1 == s { print $2 }'
}

# api waits on migrate through service_completed_successfully, so a migration
# that failed leaves api unstarted and every probe below timing out on nothing.
migrate_state=$(docker compose ps -a --format '{{.Service}} {{.State}} {{.ExitCode}}' | awk '$1 == "migrate" { print $2, $3 }')
[ "$migrate_state" = "exited 0" ] ||
  fail "the migrate container did not complete: ${migrate_state:-no migrate container}" migrate db
echo "  ok  migrate container exited 0"

# Readiness only: any HTTP response means the container is listening. Whether
# the response is *correct* is what probe() decides below, so a bad status fails
# fast instead of spinning out this timeout.
wait_for() { # url, service
  local state
  for _ in $(seq 1 120); do
    curl -s -o /dev/null "$1" && return 0
    # A container that crashed on boot is never going to answer, and that is the
    # shape standalone failed in. Report it now instead of after the timeout.
    state=$(state_of "$2")
    case "$state" in
      running | restarting | created) ;;
      *) fail "the $2 container is ${state:-missing}, so nothing will answer $1" "$2" ;;
    esac
    sleep 1
  done
  fail "nothing listening at $1 after 120s" "$2"
}

probe() { # description, url, expected-status, service
  local got
  got=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$2")
  [ "$got" = "$3" ] || fail "$1: expected $3 from $2, got $got" "$4"
  echo "  ok  [$got] $1"
}

wait_for "$API/api/hello" api
wait_for "$WEB/" web

probe "web container serves the app" "$WEB/" 200 web
probe "api container serves /api" "$API/api/hello" 200 api
# Only the container stack exercises this: the web image is built with
# API_HOST=api, so a request to the web port has to cross the compose network.
probe "web rewrites /api to the api container" "$WEB/api/hello" 200 web
# an unmatched /api path must 404 from the router, not 500 out of middleware
probe "unknown api route 404s" "$WEB/api/__nope__" 404 api
probe "auth guard rejects anonymous" "$WEB/api/todos" 401 api

body=$(curl -sf "$API/api/hello")
case "$body" in
  *"Hello from Nest"*) ;;
  *) fail "unexpected /api/hello body: $body" api ;;
esac
echo "  ok  /api/hello body: $body"

# Status codes cannot tell you that sessions broke: a dependency bump can leave
# every probe above green while sign-up stops issuing a usable cookie. So drive
# the product's actual claim over HTTP (sign up, keep the session, write a row,
# read it back), the one check that exercises better-auth, Kysely, Nest, Next
# and Postgres together, here across container boundaries.
JAR=$(mktemp)
EMAIL="smoke-compose-$$@example.com"
TITLE="smoke compose todo $$"

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

# A 5xx here means a container threw, and the reason is only in its log.
expect() { # description, expected-status, substring the body must contain
  [ "$STATUS" = "$2" ] || fail "$1: expected $2, got $STATUS: $RESP" api web
  case "$RESP" in
    *"$3"*) ;;
    *) fail "$1: body does not contain '$3': $RESP" api web ;;
  esac
  echo "  ok  [$STATUS] $1"
}

# Through the web port, so the flow crosses the rewrite the way a browser would.
request POST "$WEB/api/auth/sign-up/email" \
  "{\"email\":\"$EMAIL\",\"password\":\"smoke-password-123\",\"name\":\"Smoke\"}"
expect "sign-up creates a user" 200 "$EMAIL"

# The jar, not the sign-up response: proves the cookie better-auth set resolves
# back to a session row in the db container, which every guarded route needs.
request GET "$WEB/api/auth/get-session"
expect "the session cookie resolves to a user" 200 "$EMAIL"

request POST "$WEB/api/todos" "{\"title\":\"$TITLE\"}"
expect "creating a todo persists it" 201 "$TITLE"

request GET "$WEB/api/todos"
expect "the created todo reads back" 200 "$TITLE"

echo "smoke-compose: ok"
