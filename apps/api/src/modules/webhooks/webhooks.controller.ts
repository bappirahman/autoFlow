import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { WebhooksService } from './webhooks.service';
import { User } from '@/common/decorators/user.decorator';
import {
  WebhookProvider,
  type WebhookProviderEnum,
} from '@/common/enums/webhook-provider';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get(':nodeId/:provider')
  async getOrCreateWebhook(
    @Param('nodeId') nodeId: string,
    @Param('provider') provider: string,
    @User('id') userId: string | undefined,
  ) {
    if (!userId) throw new UnauthorizedException();

    const validProviders = Object.values(WebhookProvider) as string[];
    if (!validProviders.includes(provider)) {
      throw new BadRequestException(`Invalid provider: ${provider}`);
    }

    return this.webhooksService.registerWebhook(
      nodeId,
      userId,
      provider as WebhookProviderEnum,
    );
  }

  @AllowAnonymous()
  @Post(':provider/:secret')
  async handleWebhook(
    @Param('provider') provider: string,
    @Param('secret') secret: string,
    @Body() payload: Record<string, unknown>,
  ) {
    const validProviders = Object.values(WebhookProvider) as string[];
    if (!validProviders.includes(provider)) {
      throw new BadRequestException(`Invalid provider: ${provider}`);
    }

    return this.webhooksService.handleWebhook(
      provider as WebhookProviderEnum,
      secret,
      payload,
    );
  }
}
