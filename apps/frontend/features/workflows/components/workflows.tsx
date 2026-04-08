"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/entity-component";
import {
  useCreateWorkflow,
  useWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { type Workflow } from "@/features/workflows/types/workflow";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export const WorkflowsSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      placeholder="Search workflows..."
      value={searchValue}
      onChange={onSearchChange}
    />
  );
};

export const WorkflowList = () => {
  const { data, isPending, isError, error } = useWorkflows();

  if (isPending) {
    return <div>Loading workflows...</div>;
  }

  if (isError) {
    return <div>Failed to load workflows: {error.message}</div>;
  }

  const workflows: Workflow[] = data?.items ?? [];

  if (workflows.length === 0) {
    return <div>No workflows yet.</div>;
  }

  return (
    <ul className="space-y-2">
      {workflows.map((workflow: Workflow) => (
        <li key={workflow.id} className="rounded-md border p-3">
          <p className="font-medium">{workflow.name}</p>
          <p className="text-sm text-muted-foreground">
            Created at: {new Date(workflow.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const createWorkflow = useCreateWorkflow();
  const router = useRouter();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: (data) => {
        router.push(`/workflows/${data[0].id}`);
      },
    });
  };
  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={handleCreate}
        OnNewButtonLabel="New workflow"
        disabled={disabled}
        isCreating={createWorkflow.isPending}
      />
    </>
  );
};

export const WorkflowsPagination = () => {
  const workflows = useWorkflows();
  const [params, setParams] = useWorkflowsParams();

  const totalPages = workflows.data?.totalPages ?? 1;
  const page = workflows.data?.page ?? params.page;

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={totalPages}
      page={page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const WorkfkowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkflowsSearch />}
      pagination={<WorkflowsPagination />}
    >
      {children}
    </EntityContainer>
  );
};
