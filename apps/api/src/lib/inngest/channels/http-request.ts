import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';

export const httpRequestChannel = channel(
  (userId: string) => `http-request:${userId}`,
).addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
