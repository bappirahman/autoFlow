"use client";

import { formatDistanceToNow } from "date-fns";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-component";
import {
  useCreateWorkflow,
  useRemoveWorkflow,
  useWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { useWorkflowsParams } from "@/features/workflows/hooks/use-workflows-params";
import { type Workflow } from "@/features/workflows/types/workflow";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { WorkflowIcon } from "lucide-react";
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

export const WorkflowsList = () => {
  const { data, isPending, isError, error } = useWorkflows();

  if (isPending) {
    return <LoadingView entity="workflows" message="Loading workflows..." />;
  }

  if (isError) {
    return <div>Failed to load workflows: {error.message}</div>;
  }

  const workflows: Workflow[] = data?.items ?? [];

  if (workflows.length === 0) {
    return <WorkflowsEmpty />;
  }

  return (
    <EntityList
      items={workflows}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
    />
  );

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

export const WorkflowsLoading = () => {
  return <LoadingView entity="workflows" message="Loading workflows..." />;
};

export const WorkflowsError = () => {
  return <ErrorView message="Failed to load workflows." />;
};

export const WorkflowsEmpty = () => {
  const createWorkflow = useCreateWorkflow();
  const { handleError, modal } = useUpgradeModal();

  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      // onSuccess: (data) => {
      //   router.push(`/workflows/${data[0].id}`);
      // },
    });
  };

  return (
    <>
      {modal}
      <EmptyView
        message="You haven't created any workflows yet or your search didn't match any workflows. Create a new workflow to get started."
        onNew={handleCreate}
      />
    </>
  );
};

type WorkflowItemProps = {
  workflow: Workflow;
};

export const WorkflowItem = ({ workflow }: WorkflowItemProps) => {
  const { id, name, createdAt, updatedAt } = workflow;
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id });
  };

  return (
    <EntityItem
      href={`/workflows/${id}`}
      title={name}
      subtitle={
        <>
          Updated{" "}
          {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })} &bull;
          Created{" "}
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
