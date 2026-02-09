import { Inngest } from 'inngest';
import { generateText } from 'ai';
import { google } from '@/lib/model-providers/google';

export const inngest = new Inngest({ id: process.env.APP_NAME || 'autoFlow' });

const testExecute = inngest.createFunction(
  {
    id: 'test-execute',
    name: 'Test Execute',
    description: 'A test function to demonstrate Inngest with NestJS',
    retries: 0,
  },
  { event: 'test/execute' },
  async ({ step }) => {
    const { text } = await step.ai.wrap('using-vercel-ai', generateText, {
      model: google('gemini-2.0-flash'),
      system: 'You are a helpful assistant.',
      prompt: 'What is love?',
    });
    return { message: text };
  },
);

export const functions = [testExecute];
