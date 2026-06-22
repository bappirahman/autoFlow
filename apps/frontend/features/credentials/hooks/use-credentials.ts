"use client";

import {
  createCredential,
  fetchCredentials,
  removeCredential,
} from "@/features/credentials/api/credential.api";
import type {
  CreateCredentialDto,
  CredentialsResponse,
} from "@/features/credentials/types/credential";
import { credentialKeys } from "@/lib/query-keys/credentials";
import { useCredentialsParams } from "./use-credentials-params";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useCredentials = (
  options: Omit<
    UseQueryOptions<
      CredentialsResponse,
      Error,
      CredentialsResponse,
      ReturnType<typeof credentialKeys.list>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const [params] = useCredentialsParams();
  return useQuery({
    queryKey: credentialKeys.list(params),
    queryFn: () => fetchCredentials({ params }),
    ...options,
  });
};

export const useSuspenseCredentials = () => {
  const [params] = useCredentialsParams();
  return useSuspenseQuery({
    queryKey: credentialKeys.list(params),
    queryFn: () => fetchCredentials({ params }),
  });
};

export const useCreateCredential = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof createCredential>>,
    Error,
    CreateCredentialDto
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: (dto: CreateCredentialDto) => createCredential(dto),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: credentialKeys.all });
      toast.success(`${data.name} credential created successfully`);
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(`Failed to create credential: ${error.message}`);
      onError?.(error, variables, onMutateResult, context);
    },
  });
};

export const useRemoveCredential = (
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof removeCredential>>,
    Error,
    { id: string }
  >,
) => {
  const { onSuccess, onError, ...restOptions } = options ?? {};
  const queryClient = useQueryClient();

  return useMutation({
    ...restOptions,
    mutationFn: ({ id }: { id: string }) => removeCredential({ id }),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: credentialKeys.all });
      toast.success("Credential removed successfully");
      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      toast.error(`Failed to remove credential: ${error.message}`);
      onError?.(error, variables, onMutateResult, context);
    },
  });
};
