import type { NodeExecutor } from '@/types';
import { NodeStatus } from '@autoflow/shared';
import { googleFormChannel } from '@/lib/inngest/channels/google-form';
import { createPublishStatus } from '@/lib/inngest/utils';

type GoogleFormData = Record<string, unknown>;

export const googleFormExecutor: NodeExecutor<GoogleFormData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    googleFormChannel(userId),
    nodeId,
  );

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('google-form-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
