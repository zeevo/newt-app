import { Controller, Get } from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  @AllowAnonymous()
  @Get('hello')
  getHello(@Session() session: UserSession | null) {
    if (session?.user.name) {
      return { message: `Hello ${session.user.name}` };
    }

    return { message: 'Hello from Nest' };
  }
}
