import { inngest } from '@/lib/inngest/client';
import { InngestEvents } from '@/lib/inngest/events';
import { Injectable, NotFoundException } from '@nestjs/common';
import { WebhooksRepository } from './webhooks.repository';
import { WorkflowsRepository } from '@/modules/workflows/workflows.repository';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly webhooksRepository: WebhooksRepository,
    private readonly workflowsRepository: WorkflowsRepository,
  ) {}

  async registerWebhook(workflowId: string, userId: string) {
    await this.workflowsRepository.findById(workflowId, userId);

    const existing = await this.webhooksRepository.findByWorkflowId(workflowId);
    if (existing) return existing;

    return this.webhooksRepository.create(workflowId);
  }

  async handleGoogleFormSubmission(
    secret: string,
    body: Record<string, unknown>,
  ) {
    const webhook = await this.webhooksRepository.findBySecret(secret);

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

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
        workflowId: webhook.workflowId,
        userId: webhook.userId,
        initialData: { googleForm: formData },
      },
    });

    return { received: true, executionId: ids[0] };
  }
}
