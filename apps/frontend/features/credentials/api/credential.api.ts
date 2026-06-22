import type {
  Credential,
  CreateCredentialDto,
  CredentialsQueryParams,
  CredentialsResponse,
} from "@/features/credentials/types/credential";
import { api } from "@/lib/api/config/axios";
import { API_ENDPOINTS } from "@/lib/api/config/endpoints";

export const fetchCredentials = async ({
  params,
}: {
  params?: CredentialsQueryParams;
} = {}): Promise<CredentialsResponse> => {
  const response = await api.get(API_ENDPOINTS.CREDENTIALS.getAll, { params });
  return response.data;
};

export const createCredential = async (dto: CreateCredentialDto): Promise<Credential> => {
  const response = await api.post(API_ENDPOINTS.CREDENTIALS.create, dto);
  return response.data;
};

export const removeCredential = async ({ id }: { id: string }): Promise<Credential[]> => {
  const response = await api.delete(API_ENDPOINTS.CREDENTIALS.remove(id));
  return response.data;
};
