import { geminiExecutor } from '@/lib/inngest/executors/gemini';
import { anthropicExecutor } from '@/lib/inngest/executors/anthropic';
import { openaiExecutor } from '@/lib/inngest/executors/openai';
import { googleFormExecutor } from '@/lib/inngest/executors/google-form';
import { httpRequestExecutor } from '@/lib/inngest/executors/http-request';
import { manualTriggerExecutor } from '@/lib/inngest/executors/manual-trigger';
import { stripeTriggerExecutor } from '@/lib/inngest/executors/stripe-trigger';
import { NodeExecutor } from '@/types';
import { NodeType, NodeTypeEnum } from '@autoflow/shared';
import { discordExecutor } from '@/lib/inngest/executors/discord';

export const executorRegistry: Record<NodeTypeEnum, NodeExecutor> = {
  [NodeType.INITIAL]: manualTriggerExecutor, // Initial will never be executed, but we need to have an executor for it to avoid errors during topological sort
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openaiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
  [NodeType.DISCORD]: discordExecutor,
  [NodeType.SLACK]: discordExecutor, // TODO: replace with slackExecutor
};

export const getExecutor = (type: NodeTypeEnum): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }
  return executor;
};
