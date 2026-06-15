import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
import { getChannelKey } from '@/lib/inngest/utils';

export const httpRequestChannel = channel((userId: string) =>
  getChannelKey(userId, 'http-request'),
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
