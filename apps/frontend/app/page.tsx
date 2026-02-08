"use client";

import LogoutButton from "@/components/logoutButton";
import { authClient } from "@/lib/auth-client";
import { useWorkflows } from "@/features/workflow/hooks/use-workflows";

export default function Home() {
  const { data } = authClient.useSession();
  const {
    data: workflows,
    isLoading,
    isError,
    error,
  } = useWorkflows({
    enabled: !!data,
  });

  return (
    <section className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data)}
      {isLoading && <div>Loading workflows...</div>}
      {isError && (
        <div>{error instanceof Error ? error.message : "Failed to load"}</div>
      )}
      {!isLoading && !isError && (
        <pre>{JSON.stringify(workflows, null, 2)}</pre>
      )}
      {data && <LogoutButton />}
    </section>
  );
}
