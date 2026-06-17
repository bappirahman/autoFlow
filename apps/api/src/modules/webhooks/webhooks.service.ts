import { inngest } from '@/lib/inngest/client';
import { InngestEvents } from '@/lib/inngest/events';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhooksRepository } from './webhooks.repository';
import {
  WebhookProvider,
  type WebhookProviderEnum,
} from '@/common/enums/webhook-provider';

@Injectable()
export class WebhooksService {
  constructor(private readonly webhooksRepository: WebhooksRepository) {}

  async registerWebhook(
    nodeId: string,
    userId: string,
    provider: WebhookProviderEnum,
  ) {
    const owned = await this.webhooksRepository.findNodeOwner(nodeId, userId);
    if (!owned) throw new UnauthorizedException('Node not found');

    return this.webhooksRepository.createOrGet(
      nodeId,
      owned.workflowId,
      provider,
    );
  }

  async handleWebhook(
    provider: WebhookProviderEnum,
    secret: string,
    body: Record<string, unknown>,
  ) {
    const webhook = await this.webhooksRepository.findBySecret(secret);

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    if (webhook.provider !== provider) {
      throw new BadRequestException('Provider mismatch');
    }

    switch (provider) {
      case WebhookProvider.GOOGLE_FORM:
        return this.handleGoogleForm(webhook.workflowId, webhook.userId, body);
      case WebhookProvider.STRIPE:
        return this.handleStripe(webhook.workflowId, webhook.userId, body);
      default:
        throw new BadRequestException(
          `Unsupported webhook provider: ${provider as string}`,
        );
    }
  }

  private async handleStripe(
    workflowId: string,
    userId: string,
    body: Record<string, unknown>,
  ) {
    const stripeData = {
      eventId: body.id,
      eventType: body.type,
      created: body.created,
      amount: (body.data as Record<string, unknown>)?.object
        ? ((body.data as Record<string, Record<string, unknown>>).object
            .amount ?? null)
        : null,
      currency: (body.data as Record<string, unknown>)?.object
        ? ((body.data as Record<string, Record<string, unknown>>).object
            .currency ?? null)
        : null,
      customerId: (body.data as Record<string, unknown>)?.object
        ? ((body.data as Record<string, Record<string, unknown>>).object
            .customer ?? null)
        : null,
      object: (body.data as Record<string, unknown>)?.object ?? null,
      raw: body,
    };

    const { ids } = await inngest.send({
      name: InngestEvents.EXECUTE_WORKFLOW,
      data: {
        workflowId,
        userId,
        initialData: { stripe: stripeData },
      },
    });

    return { received: true, executionId: ids[0] };
  }

  private async handleGoogleForm(
    workflowId: string,
    userId: string,
    body: Record<string, unknown>,
  ) {
    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };

    const { ids } = await inngest.send({
      name: InngestEvents.EXECUTE_WORKFLOW,
      data: {
        workflowId,
        userId,
        initialData: { googleForm: formData },
      },
    });

    return { received: true, executionId: ids[0] };
  }
}
