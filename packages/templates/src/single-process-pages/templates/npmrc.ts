export default {
  filename: ".npmrc",
  template: `public-hoist-pattern[]=@nestjs/*
public-hoist-pattern[]=reflect-metadata
public-hoist-pattern[]=class-transformer
public-hoist-pattern[]=class-validator
public-hoist-pattern[]=rxjs
`,
};
