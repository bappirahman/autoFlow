export const queryDefaults = {
  global: {
    staleTime: 30 * 1000, // 30 seconds
    retries: 2,
  },
} as const;
