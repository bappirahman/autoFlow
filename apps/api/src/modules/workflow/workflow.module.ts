import { Module } from '@nestjs/common';
import { WorkflowEventsController } from './workflow.events.controller';
import { WorkflowService } from './workflow.service';

@Module({
  controllers: [WorkflowEventsController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
