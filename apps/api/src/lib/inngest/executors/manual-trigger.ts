import type { NodeExecutor } from '@/types';
import { manualChannel } from '@/lib/inngest/channels/manual';
import { NodeStatus } from '@autoflow/shared';
import { createPublishStatus } from '@/lib/inngest/utils';

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    manualChannel(userId),
    nodeId,
  );

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('manual-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
