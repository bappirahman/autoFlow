export const executionKeys = {
  all: ["executions"] as const,
  list: (filters: unknown) => [...executionKeys.all, filters] as const,
  details: (id: string) => [...executionKeys.all, "details", id] as const,
  httpRequestStatusToken: () =>
    [...executionKeys.all, "http-request-status-token"] as const,
  geminiStatusToken: () =>
    [...executionKeys.all, "gemini-status-token"] as const,
  discordStatusToken: () =>
    [...executionKeys.all, "discord-status-token"] as const,
  slackStatusToken: () => [...executionKeys.all, "slack-status-token"] as const,
  openaiStatusToken: () =>
    [...executionKeys.all, "openai-status-token"] as const,
  anthropicStatusToken: () =>
    [...executionKeys.all, "anthropic-status-token"] as const,
  manualTriggerStatusToken: () =>
    [...executionKeys.all, "manual-trigger-status-token"] as const,
  googleFormTriggerStatusToken: () =>
    [...executionKeys.all, "google-form-trigger-status-token"] as const,
  stripeTriggerStatusToken: () =>
    [...executionKeys.all, "stripe-trigger-status-token"] as const,
};
