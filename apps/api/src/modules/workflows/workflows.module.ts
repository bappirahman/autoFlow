import { Module } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsRepository } from './workflows.repository';

@Module({
  controllers: [WorkflowsController],
  providers: [WorkflowsService, WorkflowsRepository],
  exports: [WorkflowsRepository],
})
export class WorkflowsModule {}
