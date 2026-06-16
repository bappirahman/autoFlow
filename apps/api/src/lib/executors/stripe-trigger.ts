import type { NodeExecutor } from '@/types';
import { NodeStatus, type NodeStatusEnum } from '@autoflow/shared';
import { stripeTriggerChannel } from '@/lib/inngest/channels/stripe-trigger';

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: NodeStatusEnum) => {
    await publish(
      stripeTriggerChannel(userId).status({
        nodeId,
        status,
      }),
    );
  };

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('stripe-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
