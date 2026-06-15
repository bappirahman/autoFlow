export const executionKeys = {
  all: ['executions'] as const,
  httpRequestStatusToken: () =>
    [...executionKeys.all, 'http-request-status-token'] as const,
  manualTriggerStatusToken: () =>
    [...executionKeys.all, 'manual-trigger-status-token'] as const,
  googleFormTriggerStatusToken: () =>
    [...executionKeys.all, 'google-form-trigger-status-token'] as const,
};
