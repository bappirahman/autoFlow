export const queryKeys = {
  workflow: {
    all: ["workflow"] as const,
    lists: () => [...queryKeys.workflow.all, "list"] as const,
    list: (filters: { search?: string; page?: number }) =>
      [...queryKeys.workflow.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.workflow.all, "detail", id] as const,
  },

  // posts: {
  //   all: ["posts"] as const,
  //   lists: () => [...queryKeys.posts.all, "list"] as const,
  //   list: (page: number) => [...queryKeys.posts.lists(), page] as const,
  //   detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
  // },
};
