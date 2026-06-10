import { Module } from '@nestjs/common';
import { InngestRealtimeController } from './inngest-realtime.controller';

@Module({
  controllers: [InngestRealtimeController],
})
export class InngestRealtimeModule {}
