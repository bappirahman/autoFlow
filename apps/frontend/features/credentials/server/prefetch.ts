import { fetchCredentials } from "@/features/credentials/api/credential.api";
import type { CredentialsQueryParams } from "@/features/credentials/types/credential";
import { credentialKeys } from "@/lib/query-keys/credentials";
import { type QueryClient } from "@tanstack/react-query";

export const prefetchCredentials = async ({
  queryClient,
  params,
}: {
  queryClient: QueryClient;
  params?: CredentialsQueryParams;
}): Promise<void> => {
  await queryClient.prefetchQuery({
    queryKey: credentialKeys.list(params),
    queryFn: () => fetchCredentials({ params }),
  });
};
