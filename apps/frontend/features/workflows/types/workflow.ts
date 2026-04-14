export type Workflow = {
  id: string;
  name: string;
  createdAt: string;
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
