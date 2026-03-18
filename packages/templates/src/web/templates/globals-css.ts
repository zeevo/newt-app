export default {
  filename: "apps/web/app/globals.css",
  template: `@import 'tailwindcss';

html,
body {
  height: 100%;
}

body {
  color: #f9fafb;
  background-color: #111827;
  -webkit-font-smoothing: antialiased;
}

* {
  @apply border-gray-700;
}`,
};
