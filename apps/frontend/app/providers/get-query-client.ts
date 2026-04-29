import { queryDefaults } from "@/lib/query-defaults";
import { QueryClient } from "@tanstack/react-query";

const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryDefaults.global.staleTime,
        retry: queryDefaults.global.retries,
      },
    },
  });
};

let browserQueryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
};
