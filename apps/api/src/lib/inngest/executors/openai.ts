import { openaiChannel } from '@/lib/inngest/channels/openai';
import type { NodeExecutor } from '@/types';
import { createOpenAI } from '@ai-sdk/openai';
import { OPENAI_MODELS, NodeStatus, type OpenAIModel } from '@autoflow/shared';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createPublishStatus } from '@/lib/inngest/utils';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context ?? null, null, 2);
  return new Handlebars.SafeString(jsonString);
});

type OpenAIData = {
  variableName?: string;
  model?: OpenAIModel;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openaiExecutor: NodeExecutor<OpenAIData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    openaiChannel(userId),
    nodeId,
  );
  await publishStatus(NodeStatus.LOADING);

  if (!data.variableName) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'OpenAI Node: Variable name is required for OpenAI node',
    );
  }

  if (!data.userPrompt) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'OpenAI Node: User prompt is required for OpenAI node',
    );
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : 'You are a helpful assistant.';

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // TODO: Fetch credential that user selected

  const credentialValue = process.env.OPENAI_API_KEY;

  if (!credentialValue) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'OpenAI Node: OpenAI API key is not configured',
    );
  }

  const openai = createOpenAI({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap('openai-generate-text', generateText, {
      model: openai(data.model || OPENAI_MODELS[0]),
      system: systemPrompt,
      prompt: userPrompt,
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });

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
      'OpenAI Node: Failed to generate content with OpenAI',
    );
  }
};
