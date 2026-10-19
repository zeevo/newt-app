import type { Selection } from "../../types";
export default {
  when: (s: Selection) => s.nest === "on",
  filename: "apps/api/src/app.module.spec.ts",
  template: `import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('compiles', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    expect(moduleRef).toBeDefined();
  });
});`,
};
