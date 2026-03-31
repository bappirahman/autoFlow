export const workflowKeys = {
  all: ["workflows"] as const,
  list: (filters: { search?: string; page?: number } = {}) =>
    [filters] as const,
  detail: (id: string) => [...workflowKeys.all, "detail", id] as const,
};
