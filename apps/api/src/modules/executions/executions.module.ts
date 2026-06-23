import { Module } from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import { ExecutionsController } from './executions.controller';
import { ExecutionsRepository } from './executions.repository';

@Module({
  controllers: [ExecutionsController],
  providers: [ExecutionsService, ExecutionsRepository],
})
export class ExecutionsModule {}
