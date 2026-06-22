export const credentialKeys = Object.freeze({
  all: ["credentials"] as const,
  list: (filters: unknown) => [...credentialKeys.all, filters] as const,
} as const);
