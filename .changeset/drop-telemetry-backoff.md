---
"create-newt-app": patch
---

drop the telemetry state file and tighten the send timeout

Telemetry no longer writes `~/.local/state/create-newt-app/telemetry.json`. The 30-day unreachable backoff it existed for is gone with it: a single failed send used to cache "this endpoint is unreachable" for a month, which a server-side fix could not undo, and an HTTP error armed it exactly as hard as an unreachable network.

The timeout does the same job without persisting anything. A real round trip to the edge measures about 110ms, and DNS or connection-refused failures return in about the same, so only a firewall that drops packets waits out the budget. That budget is now 1s rather than 2s, which halves what such a network pays per scaffold.
