export const workflowKeys = Object.freeze({
  all: ["workflows"] as const,
  list: (filters: unknown) => [...workflowKeys.all, filters] as const,
  details: (id: string) => [...workflowKeys.all, "details", id] as const,
} as const);
