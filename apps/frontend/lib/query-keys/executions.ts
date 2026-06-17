export const executionKeys = {
  all: ['executions'] as const,
  httpRequestStatusToken: () =>
    [...executionKeys.all, 'http-request-status-token'] as const,
  geminiStatusToken: () =>
    [...executionKeys.all, 'gemini-status-token'] as const,
  manualTriggerStatusToken: () =>
    [...executionKeys.all, 'manual-trigger-status-token'] as const,
  googleFormTriggerStatusToken: () =>
    [...executionKeys.all, 'google-form-trigger-status-token'] as const,
  stripeTriggerStatusToken: () =>
    [...executionKeys.all, 'stripe-trigger-status-token'] as const,
};
