import type { NodeExecutor } from '@/types';
import { NodeStatus, type NodeStatusEnum } from '@autoflow/shared';
import { stripeChannel } from '@/lib/inngest/channels/stripe';

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
      stripeChannel(userId).status({
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
