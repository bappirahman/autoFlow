import { googleFormExecutor } from '@/lib/executors/google-form';
import { httpRequestExecutor } from '@/lib/executors/http-request';
import { manualTriggerExecutor } from '@/lib/executors/manual-trigger';
import { stripeTriggerExecutor } from '@/lib/executors/stripe-trigger';
import { NodeExecutor } from '@/types';
import { NodeType, NodeTypeEnum } from '@autoflow/shared';

export const executorRegistry: Record<NodeTypeEnum, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor, // Initial will never be executed, but we need to have an executor for it to avoid errors during topological sort
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
};

export const getExecutor = (type: NodeTypeEnum): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};
