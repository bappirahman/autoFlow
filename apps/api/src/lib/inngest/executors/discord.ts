import type { NodeExecutor } from '@/types';
import { NodeStatus } from '@autoflow/shared';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createPublishStatus } from '@/lib/inngest/utils';
import { DiscordChannel } from '@/lib/inngest/channels/discord';
import { decode } from 'html-entities';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context ?? null, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    DiscordChannel(userId),
    nodeId,
  );
  await publishStatus(NodeStatus.LOADING);

  if (!data.variableName) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Discord Node: Variable name is required for Discord node',
    );
  }

  if (!data.content) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Discord Node: Content is required for Discord node',
    );
  }
  if (!data.webhookUrl) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Discord Node: Webhook URL is required for Discord node',
    );
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const decodedContent = decode(rawContent);

  const username = data.username
    ? Handlebars.compile(data.username)(context)
    : undefined;

  try {
    const result = await step.run('discord-webhook', async () => {
      const response = await step.fetch(data.webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: decodedContent.slice(0, 2000), // Discord has a limit of 2000 characters for message content
          username,
        }),
      });

      return {
        ...context,
        [data.variableName!]: {
          discordMessageSent: true,
          messageContent: decodedContent.slice(0, 2000),
          username: username ?? null,
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
      'Discord Node: Failed to send message to Discord. Please check the webhook URL and try again.',
    );
  }
};
