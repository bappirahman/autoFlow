"use client";

import LogoutButton from "@/components/logoutButton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data } = authClient.useSession();
  const router = useRouter();

  return (
    <section className="min-h-screen min-w-screen flex items-center justify-center">
      {JSON.stringify(data)}
      {data && <LogoutButton />}
    </section>
  );
}
