"use client";

import { formatDistanceToNow, format } from "date-fns";

import { LoadingView } from "@/components/entity-component";
import { StatusBadge } from "@/features/executions/components/execution-history";
import { useExecutionHistoryItem } from "@/features/executions/hooks/use-execution-history";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

type ExecutionDetailProps = {
  id: string;
};

export const ExecutionDetail = ({ id }: ExecutionDetailProps) => {
  const { data, isLoading, isError } = useExecutionHistoryItem({ id });
  const [errorStackOpen, setErrorStackOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(true);

  if (isLoading) {
    return <LoadingView entity="execution" message="Loading execution..." />;
  }

  if (isError || !data) {
    return (
      <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
        <AlertTriangleIcon className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">
          Execution not found or failed to load.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/executions">
            <ArrowLeftIcon className="size-4" />
            Back to executions
          </Link>
        </Button>
      </div>
    );
  }

  const {
    workflowId,
    workflowName,
    status,
    startedAt,
    completedAt,
    output,
    error,
    errorStack,
  } = data;

  const durationMs =
    completedAt && startedAt
      ? new Date(completedAt).getTime() - new Date(startedAt).getTime()
      : null;

  const formatDurationMs = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-6">
        <div className="flex items-center gap-x-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/executions">
              <ArrowLeftIcon className="size-4" />
              Executions
            </Link>
          </Button>
        </div>

        <Card className="shadow-none">
          <CardContent className="p-6 flex flex-col gap-y-6">
            <div className="flex items-start justify-between gap-x-4">
              <div className="flex flex-col gap-y-1">
                <CardTitle className="text-lg font-semibold">
                  <Link
                    href={`/workflows/${workflowId}`}
                    className="hover:underline"
                  >
                    {workflowName}
                  </Link>
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Started{" "}
                  {formatDistanceToNow(new Date(startedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <StatusBadge status={status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-y-1">
                <p className="text-xs text-muted-foreground">Started at</p>
                <p className="text-sm font-medium">
                  {format(new Date(startedAt), "MMM d, yyyy HH:mm:ss")}
                </p>
              </div>
              {completedAt && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-xs text-muted-foreground">Completed at</p>
                  <p className="text-sm font-medium">
                    {format(new Date(completedAt), "MMM d, yyyy HH:mm:ss")}
                  </p>
                </div>
              )}
              {durationMs !== null && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">
                    {formatDurationMs(durationMs)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {status === "SUCCESS" && output && (
          <Card className="shadow-none">
            <CardContent className="p-6 flex flex-col gap-y-3">
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOutputOpen((prev) => !prev)}
              >
                <CardTitle className="text-base font-medium">Output</CardTitle>
                <ChevronDownIcon
                  className={`size-4 text-muted-foreground transition-transform ${outputOpen ? "rotate-180" : ""}`}
                />
              </button>
              {outputOpen && (
                <pre className="text-xs bg-muted rounded-md p-4 overflow-auto max-h-96 whitespace-pre-wrap break-words">
                  {JSON.stringify(output, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {status === "FAILED" && (
          <Card className="shadow-none border-red-200">
            <CardContent className="p-6 flex flex-col gap-y-4">
              <CardTitle className="text-base font-medium text-red-600">
                Error
              </CardTitle>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 rounded-md p-3 border border-red-200">
                  {error}
                </p>
              )}
              {errorStack && (
                <div className="flex flex-col gap-y-2">
                  <button
                    className="flex items-center gap-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setErrorStackOpen((prev) => !prev)}
                  >
                    <ChevronDownIcon
                      className={`size-3 transition-transform ${errorStackOpen ? "rotate-180" : ""}`}
                    />
                    {errorStackOpen ? "Hide" : "Show"} stack trace
                  </button>
                  {errorStackOpen && (
                    <pre className="text-xs bg-muted rounded-md p-4 overflow-auto max-h-96 whitespace-pre-wrap break-words">
                      {errorStack}
                    </pre>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
