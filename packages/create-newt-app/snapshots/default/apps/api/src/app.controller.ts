import { Controller, Get } from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  UserSession,
} from '@thallesp/nestjs-better-auth';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @AllowAnonymous()
  @Get('hello')
  getHello(@Session() session: UserSession | null) {
    if (session?.user.name) {
      return { message: `Hello ${session.user.name}` };
    }

    return { message: this.appService.getHello() };
  }
}