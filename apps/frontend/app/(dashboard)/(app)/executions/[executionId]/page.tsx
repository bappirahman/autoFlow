interface IPageProps {
  params: Promise<{
    executionId: string;
  }>;
}

export default async function ExecutionId({ params }: IPageProps) {
  const { executionId } = await params;
  return <div>ExecutionId: {executionId}</div>;
}
