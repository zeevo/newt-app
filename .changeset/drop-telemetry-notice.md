---
"create-newt-app": patch
---

drop the first-run telemetry notice

The one-time block printed after the next steps is gone. `notifiedAt` went with it, so the state file now records only the unreachable backoff and is not written at all on a successful send.

Nothing else changes: the same event is sent, and `DO_NOT_TRACK=1` and `NEWT_TELEMETRY_DISABLED=1` still turn it off.
