import type { NodeExecutor } from '@/types';
import { NodeStatus, type NodeStatusEnum } from '@autoflow/shared';
import { googleFormChannel } from '@/lib/inngest/channels/google-form';

type GoogleFormData = Record<string, unknown>;

export const googleFormExecutor: NodeExecutor<GoogleFormData> = async ({
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: NodeStatusEnum) => {
    await publish(
      googleFormChannel(userId).status({
        nodeId,
        status,
      }),
    );
  };

  await publishStatus(NodeStatus.LOADING);

  const result = await step.run('google-form-trigger', () => context);

  await publishStatus(NodeStatus.SUCCESS);

  return result;
};
