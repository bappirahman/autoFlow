import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';
import { getChannelKey } from '@/lib/inngest/utils';

export const manualChannel = channel((userId: string) =>
  getChannelKey(userId, 'manual-trigger'),
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
