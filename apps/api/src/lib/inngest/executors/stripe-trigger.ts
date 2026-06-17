import type { NodeExecutor } from '@/types';
import { NodeStatus } from '@autoflow/shared';
import { createPublishStatus } from '@/lib/inngest/utils';
import { stripeChannel } from '@/lib/inngest/channels/stripe';

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    stripeChannel(userId),
    nodeId,
  );

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('stripe-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
