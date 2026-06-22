import type { NodeExecutor } from '@/types';
import { NodeStatus } from '@autoflow/shared';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createPublishStatus } from '@/lib/inngest/utils';
import { SlackChannel } from '@/lib/inngest/channels/slack';
import { decode } from 'html-entities';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context ?? null, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    SlackChannel(userId),
    nodeId,
  );
  await publishStatus(NodeStatus.LOADING);

  if (!data.variableName) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Slack Node: Variable name is required for Slack node',
    );
  }

  if (!data.content) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Slack Node: Content is required for Slack node',
    );
  }

  if (!data.webhookUrl) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Slack Node: Webhook URL is required for Slack node',
    );
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const decodedContent = decode(rawContent);

  try {
    const result = await step.run('slack-webhook', async () => {
      const response = await step.fetch(data.webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: decodedContent,
        }),
      });
      // console.log(response);

      return {
        ...context,
        [data.variableName!]: {
          slackMessageSent: true,
          messageContent: decodedContent,
          statusCode: response.status,
          statusText: response.statusText,
        },
      };
    });
    await publishStatus(NodeStatus.SUCCESS);
    return result;
  } catch {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Slack Node: Failed to send message to Slack. Please check the webhook URL and try again.',
    );
  }
};
