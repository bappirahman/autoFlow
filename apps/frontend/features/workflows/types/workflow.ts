export type Workflow = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkflowsQueryParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export type WorkflowsResponse = {
  items: Workflow[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  page: number;
  pageSize: number;
};
