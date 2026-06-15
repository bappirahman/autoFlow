import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { User } from '@/common/decorators/user.decorator';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get(':workflowId')
  async getOrCreateWebhook(
    @Param('workflowId') workflowId: string,
    @User('id') userId: string | undefined,
  ) {
    if (!userId) throw new UnauthorizedException();
    return this.webhooksService.registerWebhook(workflowId, userId);
  }

  @Post('google-form')
  async handleGoogleFormSubmission(
    @Query('secret') secret: string | undefined,
    @Body() payload: Record<string, unknown>,
  ) {
    if (!secret) throw new BadRequestException('Missing secret');
    return this.webhooksService.handleGoogleFormSubmission(secret, payload);
  }
}
