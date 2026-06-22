import { getQueryClient } from "@/app/providers/get-query-client";
import {
  CredentialsContainer,
  CredentialsError,
  CredentialsList,
  CredentialsLoading,
} from "@/features/credentials/components/credentials";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Credentials({ searchParams }: Props) {
  const queryClient = getQueryClient();
  const params = await credentialsParamsLoader(searchParams);
  await prefetchCredentials({ queryClient, params });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CredentialsContainer>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsList />
          </Suspense>
        </ErrorBoundary>
      </CredentialsContainer>
    </HydrationBoundary>
  );
}
