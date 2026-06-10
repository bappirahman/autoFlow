import type { NodeExecutor } from '@/types';
import { manualTriggerChannel } from '@/lib/inngest/channels/manual-trigger';
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
      manualTriggerChannel(userId).status({
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
