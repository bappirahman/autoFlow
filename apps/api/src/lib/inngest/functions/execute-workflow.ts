import { inngest } from '@/lib/inngest/client';

export const executeWorkflow = inngest.createFunction(
  {
    id: 'execute-workflow',
    name: 'Execute Workflow',
    description: 'A function to execute a workflow',
    retries: 0,
  },
  { event: 'workflows/execute.workflow' },
  async ({ step }) => {
    await step.sleep('test', 5000);
  },
);
