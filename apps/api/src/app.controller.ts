import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { inngest } from '@/lib/inngest/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
