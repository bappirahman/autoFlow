export const subscriptionKeys = {
  all: ["subscription"] as const,
  state: () => [...subscriptionKeys.all, "state"] as const,
};
