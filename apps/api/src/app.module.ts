import { Module } from '@nestjs/common';
import { InngestModule } from 'nest-inngest';
import { inngest } from './lib/inngest/client';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth';
import { DbModule } from './db/db.module';
import { WorkflowModule } from './modules/workflow/workflow.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    InngestModule.forRoot({
      inngest,
      path: '/api/inngest',
    }),

    DbModule,
    WorkflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
