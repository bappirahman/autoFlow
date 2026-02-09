"use client";

import LogoutButton from "@/components/logoutButton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/config/axios";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();
  // const {
  //   data: workflows,
  //   isLoading,
  //   isError,
  //   error,
  // } = useWorkflows({
  //   enabled: !!data,
  // });

  const triggerWorkflow = async () => {
    const response = await api.get("", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.data;
    console.log(result);
  };

  return (
    <section className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data)}
      {/* {isLoading && <div>Loading workflows...</div>}
      {isError && (
        <div>{error instanceof Error ? error.message : "Failed to load"}</div>
      )}
      {!isLoading && !isError && (
        <pre>{JSON.stringify(workflows, null, 2)}</pre>
      )} */}
      {data && <Button onClick={triggerWorkflow}>Trigger Workflow</Button>}
      {data && <LogoutButton />}
    </section>
  );
}
