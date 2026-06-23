"use client";

import { formatDistanceToNow } from "date-fns";

import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  LoadingView,
} from "@/components/entity-component";
import { useExecutionHistory } from "@/features/executions/hooks/use-execution-history";
import { useExecutionHistoryParams } from "@/features/executions/hooks/use-execution-history-params";
import {
  type ExecutionHistoryItem,
  type ExecutionStatus,
} from "@/features/executions/types/execution-history";
import { AlertTriangleIcon, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusConfig: Record<
  ExecutionStatus,
  { label: string; className: string }
> = {
  RUNNING: {
    label: "Running",
    className: "text-blue-600 bg-blue-50 border-blue-200",
  },
  SUCCESS: {
    label: "Success",
    className: "text-green-600 bg-green-50 border-green-200",
  },
  FAILED: {
    label: "Failed",
    className: "text-red-600 bg-red-50 border-red-200",
  },
};

export const StatusBadge = ({ status }: { status: ExecutionStatus }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const formatDurationMs = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
};

export const ExecutionsHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="View the history of your workflow runs"
      OnNewButtonLabel=""
    />
  );
};

export const ExecutionsPagination = () => {
  const executions = useExecutionHistory();
  const [params, setParams] = useExecutionHistoryParams();

  const totalPages = executions.data?.totalPages ?? 1;
  const page = executions.data?.page ?? params.page;

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={totalPages}
      page={page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const ExecutionsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionsList = () => {
  const { data, isLoading, isError, refetch } = useExecutionHistory();

  if (isLoading) {
    return <LoadingView entity="executions" message="Loading executions..." />;
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
        <AlertTriangleIcon className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">
          Failed to load executions.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const executions: ExecutionHistoryItem[] = data?.items ?? [];

  if (executions.length === 0) {
    return (
      <EmptyView message="No executions yet. Run a workflow to see its history here." />
    );
  }

  return (
    <EntityList
      items={executions}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionItem execution={execution} />}
    />
  );
};

export const ExecutionsError = () => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-primary" />
      <p className="text-sm text-muted-foreground">
        Failed to load executions.
      </p>
    </div>
  );
};

type ExecutionItemProps = {
  execution: ExecutionHistoryItem;
};

export const ExecutionItem = ({ execution }: ExecutionItemProps) => {
  const { id, workflowName, status, startedAt, completedAt } = execution;

  const durationMs =
    completedAt && startedAt
      ? new Date(completedAt).getTime() - new Date(startedAt).getTime()
      : null;

  return (
    <EntityItem
      href={`/executions/${id}`}
      title={workflowName}
      subtitle={`Started ${formatDistanceToNow(new Date(startedAt), { addSuffix: true })}${durationMs !== null ? ` · ${formatDurationMs(durationMs)}` : ""}`}
      image={
        <div className="size-8 flex items-center justify-center">
          <HistoryIcon className="size-5 text-muted-foreground" />
        </div>
      }
      actions={<StatusBadge status={status} />}
    />
  );
};
