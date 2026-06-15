export const webhookKeys = {
  all: ['webhooks'] as const,
  detail: (workflowId: string) => [...webhookKeys.all, workflowId] as const,
};
