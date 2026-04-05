export default {
  filename: "apps/web/instrumentation.ts",
  template: `export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('reflect-metadata');

    const { NestFactory } = await import('@nestjs/core');
    const { AppModule } = await import('@<%= projectName %>/api');

    const app = await NestFactory.create(AppModule);
    await app.listen(3001);

    console.log('> NestJS ready on http://localhost:3001');
  }
}`,
};
