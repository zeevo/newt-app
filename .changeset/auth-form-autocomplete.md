---
"create-newt-app": patch
---

Add autocomplete attributes to the auth form inputs so password managers can fill them and Chrome stops warning. Name and email get `name` and `email`; password gets `new-password` in sign up mode and `current-password` in sign in mode. Applies to both the plain and shadcn forms.
