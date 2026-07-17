---
"create-newt-app": patch
---

Generate a strong random `BETTER_AUTH_SECRET` (32 bytes, base64url) per scaffold instead of the `your-secret-here` placeholder, so a fresh app no longer logs Better Auth's "secret should be at least 32 characters" / low-entropy warnings.
