import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { inngest } from '@/lib/inngest/client';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/debug-sentry')
  @AllowAnonymous()
  getError() {
    throw new Error('My first Sentry error!');
  }

  @Get()
  async getHello() {
    const response = await inngest.send({
      name: 'test/execute',
      data: {
        hello: 'world',
      },
    });
    return response;
  }
}
