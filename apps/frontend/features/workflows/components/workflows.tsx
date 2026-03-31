"use client";

import { EntityContainer, EntityHeader } from "@/components/entity-component";
import {
  useCreateWorkflow,
  useWorkflows,
} from "@/features/workflows/hooks/use-workflows";
import { type Workflow } from "@/features/workflows/types/workflow";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export const WorkflowList = () => {
  // Same component supports both SSR + CSR:
  // - SSR: query is prefetched in a server component and hydrated.
  // - CSR: React Query still revalidates/fetches on client navigation.
  const { data, isPending, isError, error } = useWorkflows();

  if (isPending) {
    return <div>Loading workflows...</div>;
  }

  if (isError) {
    return <div>Failed to load workflows: {error.message}</div>;
  }

  const workflows: Workflow[] = data ?? [];

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

export const WorkfkowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};
