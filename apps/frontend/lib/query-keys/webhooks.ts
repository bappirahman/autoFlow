export const webhookKeys = {
  all: ["webhooks"] as const,
  detail: (nodeId: string, provider: string) =>
    [...webhookKeys.all, nodeId, provider] as const,
};
