import {
  WorkfkowsContainer,
  WorkflowsList,
  WorkflowsError,
} from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import { type SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Workflows({ searchParams }: Props) {
  await workflowsParamsLoader(searchParams);

  return (
    <WorkfkowsContainer>
      <ErrorBoundary fallback={<WorkflowsError />}>
        <WorkflowsList />
      </ErrorBoundary>
    </WorkfkowsContainer>
  );
}
