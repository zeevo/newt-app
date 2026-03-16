export default {
  filename: ".dockerignore",
  template: `node_modules
.next
dist
.turbo
*.log
.env
.env.*
!.env.example`,
};
