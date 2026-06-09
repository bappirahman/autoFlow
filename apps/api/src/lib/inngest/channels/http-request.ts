import { channel, topic } from '@inngest/realtime';
import type { NodeStatusEnum } from '@autoflow/shared';

export const httpRequestChannel = channel('http-request').addTopic(
  topic('status').type<{
    nodeId: string;
    status: NodeStatusEnum;
  }>(),
);
