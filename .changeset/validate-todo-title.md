---
"create-newt-app": patch
---

The todo example's `POST /api/todos` now validates `title` with Nest 12's `StandardSchemaValidationPipe` and a zod schema, so a missing, blank or non-string title returns 400 instead of a 500 or an empty todo. The api's `main.ts` registers the pipe globally, which leaves routes without a schema untouched.
