import { CredentialForm } from "@/features/credentials/components/credential";

export default function NewCredential() {
  return (
    <div className="p-4 md:px-10 md:py-6">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8">
        <CredentialForm />
      </div>
    </div>
  );
}
