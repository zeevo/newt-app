---
"create-newt-app": minor
---

Update scaffolded apps to Next 16.3, and correct the Node floor. Scaffolded apps declared `node >=18` while Next 16 requires `>=20.9.0` and NestJS 11 requires `>=20`, so Node 18 satisfied the stated constraint and then failed at build. Both the scaffolded root and `create-newt-app` itself now declare `>=20.9.0`; the CLI previously declared no `engines` at all.
