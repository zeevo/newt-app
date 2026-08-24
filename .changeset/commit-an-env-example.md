---
"create-newt-app": patch
---

commit a `.env.example` so a clone can boot

The scaffolder wrote `.env`, `.gitignore` ignored it, and `initGit` committed the result, so anyone cloning a newt app got a repo with no `BETTER_AUTH_SECRET`, no `BETTER_AUTH_URL`, no `DATABASE_URL` on postgres, and nothing naming them. A `.env.example` now ships next to `.env` with the same keys and a placeholder secret instead of the generated one.

Both files also end with a newline. `.env` used to end mid-line on the secret, so appending a variable by hand ran onto that line.
