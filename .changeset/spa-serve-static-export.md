---
"create-newt-app": patch
---

Serve the static export in `--deployment spa`. The `ServeStaticModule` template was overwritten by the api-controllers and todo-example app modules, so scaffolded SPA apps 404'd on `/`.
