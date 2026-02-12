interface IPageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

export default async function CredentialId({ params }: IPageProps) {
  const { credentialId } = await params;
  return <div>CredentialId: {credentialId}</div>;
}
