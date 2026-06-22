export type CredentialType = "OPENAI" | "ANTHROPIC" | "GEMINI";

export type Credential = {
  id: string;
  name: string;
  value: string;
  type: CredentialType;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CredentialsQueryParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type CredentialsResponse = {
  items: Credential[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
};

export type CreateCredentialDto = {
  name: string;
  value: string;
  type: CredentialType;
};

