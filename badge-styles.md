# Badge styles — pick one (demo PR, do not merge)

Comparing [img.shields.io](https://shields.io) styles for the README npm badge, plus other badges worth adding. Tell me the style + set you like and I'll apply it to the real README and close this.

## Version badge — style options

| Style | Badge |
| --- | --- |
| `flat` (default) | ![flat](https://img.shields.io/npm/v/create-newt-app) |
| `flat-square` | ![flat-square](https://img.shields.io/npm/v/create-newt-app?style=flat-square) |
| `plastic` | ![plastic](https://img.shields.io/npm/v/create-newt-app?style=plastic) |
| `for-the-badge` | ![for-the-badge](https://img.shields.io/npm/v/create-newt-app?style=for-the-badge) |
| `social` | ![social](https://img.shields.io/npm/v/create-newt-app?style=social) |

## Variants worth a look

| Description | Badge |
| --- | --- |
| Current (`for-the-badge`, black label) | ![current](https://img.shields.io/npm/v/create-newt-app?style=for-the-badge&labelColor=000000) |
| `flat` + npm logo | ![flat-logo](https://img.shields.io/npm/v/create-newt-app?logo=npm) |
| `for-the-badge` + npm logo | ![ftb-logo](https://img.shields.io/npm/v/create-newt-app?style=for-the-badge&logo=npm&logoColor=white) |
| `flat-square` + black label | ![fs-black](https://img.shields.io/npm/v/create-newt-app?style=flat-square&labelColor=000000) |
| `for-the-badge` + oxc cyan | ![ftb-cyan](https://img.shields.io/npm/v/create-newt-app?style=for-the-badge&labelColor=000000&color=00F7F1) |

## Other badges to consider

Shown in `flat-square` for consistency; we'd use whichever style we pick.

| Badge | Renders | Notes |
| --- | --- | --- |
| npm version | ![v](https://img.shields.io/npm/v/create-newt-app?style=flat-square) | Recommend — keep |
| downloads / month | ![dm](https://img.shields.io/npm/dm/create-newt-app?style=flat-square) | Add once downloads are healthy |
| node engine | ![node](https://img.shields.io/node/v/create-newt-app?style=flat-square) | Optional; signals supported Node |
| license | ![l](https://img.shields.io/npm/l/create-newt-app?style=flat-square) | Blocked: no `LICENSE` file yet |
| GitHub stars | ![stars](https://img.shields.io/github/stars/zeevo/newt-app?style=flat-square) | Blocked: repo is private |
| CI status | _n/a_ | Blocked: repo is private |

## My take

- **Style:** `flat-square` reads cleaner and more modern for a dev CLI than `for-the-badge` (which is bold/loud, more of a Next.js/marketing look). Add the npm logo if you want a touch of brand.
- **Set now:** just the npm **version** badge. Hold **downloads** until the numbers are flattering.
- **After the repo is public + licensed:** add **license**, **stars**, and a **CI status** badge — all three need a public repo (and license needs a `LICENSE` file).
