import { User } from '@/common/decorators/user.decorator';
import { inngest } from '@/lib/inngest/client';
import { httpRequestChannel } from '@/lib/inngest/channels/http-request';
import { manualChannel } from '@/lib/inngest/channels/manual';
import { getSubscriptionToken, type Realtime } from '@inngest/realtime';
import { UnauthorizedException, Controller, Get } from '@nestjs/common';
import { googleFormChannel } from '@/lib/inngest/channels/google-form';
import { stripeChannel } from '@/lib/inngest/channels/stripe';
import { geminiChannel } from '@/lib/inngest/channels/gemini';
import { anthropicChannel } from '@/lib/inngest/channels/anthropic';
import { openaiChannel } from '@/lib/inngest/channels/openai';
import { DiscordChannel } from '@/lib/inngest/channels/discord';
import { SlackChannel } from '@/lib/inngest/channels/slack';

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

  @Get('manual-trigger/status')
  async getManualTriggerStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: manualChannel(userId),
      topics: ['status'],
    });
  }
  @Get('google-form-trigger/status')
  async getGoogleFormTriggerStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: googleFormChannel(userId),
      topics: ['status'],
    });
  }
  @Get('stripe-trigger/status')
  async getStripeTriggerStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: stripeChannel(userId),
      topics: ['status'],
    });
  }
  @Get('gemini/status')
  async getGeminiExecutionStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: geminiChannel(userId),
      topics: ['status'],
    });
  }

  @Get('anthropic/status')
  async getAnthropicExecutionStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: anthropicChannel(userId),
      topics: ['status'],
    });
  }

  @Get('openai/status')
  async getOpenAIExecutionStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: openaiChannel(userId),
      topics: ['status'],
    });
  }
  @Get('discord/status')
  async getDiscordExecutionStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: DiscordChannel(userId),
      topics: ['status'],
    });
  }

  @Get('slack/status')
  async getSlackExecutionStatusToken(
    @User('id') userId: string | undefined,
  ): Promise<Realtime.Subscribe.Token> {
    if (!userId) {
      throw new UnauthorizedException('Not authenticated');
    }

    return getSubscriptionToken(inngest, {
      channel: SlackChannel(userId),
      topics: ['status'],
    });
  }
}
