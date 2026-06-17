import type { NodeExecutor } from '@/types';
import { manualChannel } from '@/lib/inngest/channels/manual';
import { NodeStatus, type NodeStatusEnum } from '@autoflow/shared';

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: NodeStatusEnum) => {
    await publish(
      manualChannel(userId).status({
        nodeId,
        status,
      }),
    );
  };

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('manual-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
