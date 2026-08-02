---
"create-newt-app": patch
---

Pass `BETTER_AUTH_URL` to the standalone Docker services. Without it Better Auth fell back to trusting `http://localhost:3000`, so a deployed stack rejected requests from its real origin.
