export type ExecutionStatus = "RUNNING" | "SUCCESS" | "FAILED";

export type ExecutionHistoryItem = {
  id: string;
  workflowId: string;
  workflowName: string;
  status: ExecutionStatus;
  output: Record<string, unknown> | null;
  error: string | null;
  errorStack: string | null;
  inngestEventId: string;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExecutionHistoryQueryParams = {
  page?: number;
  pageSize?: number;
};

export type ExecutionHistoryResponse = {
  items: ExecutionHistoryItem[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
};
