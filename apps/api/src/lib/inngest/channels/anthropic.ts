import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
import { getChannelKey } from '@/lib/inngest/utils';

export const anthropicChannel = channel((userId: string) =>
  getChannelKey(userId, 'anthropic'),
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
