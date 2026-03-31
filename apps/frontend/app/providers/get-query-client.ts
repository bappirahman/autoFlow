import { queryDefaults } from "@/lib/query-defaults";
import { QueryClient, isServer } from "@tanstack/react-query";

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

let borwserQueryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (isServer) {
    return createQueryClient();
  }
  if (!borwserQueryClient) {
    borwserQueryClient = createQueryClient();
  }

  return borwserQueryClient;
};
