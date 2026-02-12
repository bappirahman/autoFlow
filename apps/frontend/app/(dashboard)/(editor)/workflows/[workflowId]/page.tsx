interface IPageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

export default async function WorkflowId({ params }: IPageProps) {
  const { workflowId } = await params;
  return <div>WorkflowId: {workflowId}</div>;
}
