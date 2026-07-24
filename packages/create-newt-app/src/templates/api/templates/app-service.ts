export default {
  filename: "apps/api/src/app.service.ts",
  template: `import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello from Nest';
  }
}`,
};
