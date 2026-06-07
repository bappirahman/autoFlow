import type { NodeExecutor } from '@/types';

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  context,
  step,
}) => {
  // TODO: publish 'loading' state for manual trigger node

  const result = await step.run('manual-trigger', () => context);

  // TODO: publish 'success' state for manual trigger node with result

  return result;
};
