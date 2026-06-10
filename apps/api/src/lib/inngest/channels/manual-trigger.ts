import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';

export const manualTriggerChannel = channel(
  (userId: string) => `manual-trigger:${userId}`,
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
