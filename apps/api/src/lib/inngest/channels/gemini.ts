import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
import { getChannelKey } from '@/lib/inngest/utils';

export const geminiChannel = channel((userId: string) =>
  getChannelKey(userId, 'gemini'),
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
