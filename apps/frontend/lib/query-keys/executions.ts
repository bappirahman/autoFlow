export const executionKeys = {
  all: ['executions'] as const,
  httpRequestStatusToken: () => [...executionKeys.all, 'http-request-status-token'] as const,
};
