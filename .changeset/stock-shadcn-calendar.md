---
"create-newt-app": patch
---

Turn off `react/prop-types` in the React eslint config, which is redundant when props are typed, and drop the two `eslint-disable` comments it forced into the calendar component. All 60 registry components now match stock `shadcn add` output.
