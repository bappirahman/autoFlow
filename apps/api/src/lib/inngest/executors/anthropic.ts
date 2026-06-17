import { anthropicChannel } from '@/lib/inngest/channels/anthropic';
import type { NodeExecutor } from '@/types';
import { createAnthropic } from '@ai-sdk/anthropic';
import {
  ANTHROPIC_MODELS,
  NodeStatus,
  type AnthropicModel,
} from '@autoflow/shared';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createPublishStatus } from '@/lib/inngest/utils';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context ?? null, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type AnthropicData = {
  variableName?: string;
  model?: AnthropicModel;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    anthropicChannel(userId),
    nodeId,
  );
  await publishStatus(NodeStatus.LOADING);

  if (!data.variableName) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Anthropic Node: Variable name is required for Anthropic node',
    );
  }

  if (!data.userPrompt) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Anthropic Node: User prompt is required for Anthropic node',
    );
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : 'You are a helpful assistant.';

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credential that user selected

  const credentialValue = process.env.ANTHROPIC_API_KEY;

  if (!credentialValue) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Anthropic Node: Anthropic API key is not configured',
    );
  }

  const anthropic = createAnthropic({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap(
      'anthropic-generate-text',
      generateText,
      {
        model: anthropic(data.model || ANTHROPIC_MODELS[0]),
        system: systemPrompt,
        prompt: userPrompt,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    const text =
      steps[0].content[0].type == 'text' ? steps[0].content[0].text : '';

    await publishStatus(NodeStatus.SUCCESS);
    return {
      ...context,
      [data.variableName]: {
        aiResponse: {
          text,
        },
      },
    };
  } catch {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Anthropic Node: Failed to generate content with Anthropic',
    );
  }
};
