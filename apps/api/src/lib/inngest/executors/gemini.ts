import { getApp } from '@/app-ref';
import { geminiChannel } from '@/lib/inngest/channels/gemini';
import { CredentialsRepository } from '@/modules/credentials/credentials.repository';
import type { NodeExecutor } from '@/types';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { GEMINI_MODELS, NodeStatus, type GeminiModel } from '@autoflow/shared';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { NonRetriableError } from 'inngest';
import { createPublishStatus } from '@/lib/inngest/utils';

Handlebars.registerHelper('json', (context) => {
  const jsonString = JSON.stringify(context ?? null, null, 2);
  return new Handlebars.SafeString(jsonString);
});
type GeminiData = {
  variableName?: string;
  model?: GeminiModel;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  userId,
  credentialId,
  context,
  step,
  publish,
}) => {
  const publishStatus = createPublishStatus(
    publish,
    geminiChannel(userId),
    nodeId,
  );
  await publishStatus(NodeStatus.LOADING);

  if (!data.variableName) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Gemini Node: Variable name is required for Gemini node',
    );
  }

  if (!data.userPrompt) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Gemini Node: User prompt is required for Gemini node',
    );
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : 'You are a helpful assistant.';

  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  if (!credentialId) {
    await publishStatus(NodeStatus.ERROR);
    throw new NonRetriableError(
      'Gemini Node: No credential selected. Add a Gemini credential to this node.',
    );
  }

  const credRepo = getApp().get(CredentialsRepository);
  const credential = await credRepo.findByIdDecrypted(credentialId, userId);
  const credentialValue = credential.value;
  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
  });

  try {
    const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
      model: google(data.model || GEMINI_MODELS[0]),
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
      'Gemini Node: Failed to generate content with Google Generative AI',
    );
  }
};
