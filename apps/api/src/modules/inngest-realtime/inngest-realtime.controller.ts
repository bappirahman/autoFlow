import { User } from '@/common/decorators/user.decorator';
import { inngest } from '@/lib/inngest/client';
import { httpRequestChannel } from '@/lib/inngest/channels/http-request';
import { getSubscriptionToken, type Realtime } from '@inngest/realtime';
import { UnauthorizedException, Controller, Get } from '@nestjs/common';

@Controller('realtime')
export class InngestRealtimeController {
  @Get('http-request/status')
  async getHttpRequestStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: httpRequestChannel(userId),
      topics: ['status'],
    });
  }
}
