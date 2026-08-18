import type { Selection } from "../../types";
export default {
  when: (s) => s.mode === "bare",
  filename: "apps/web/__tests__/hello.spec.ts",
  template: `/// <reference types="jest" />
import { GET } from '@/app/api/hello/route';

describe('GET /api/hello', () => {
  it('answers with a json message', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      message: 'Hello from Next.js',
    });
  });
});`,
};
