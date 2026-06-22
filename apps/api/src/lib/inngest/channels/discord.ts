import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
import { getChannelKey } from '@/lib/inngest/utils';

export const DiscordChannel = channel((userId: string) =>
  getChannelKey(userId, 'discord'),
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
