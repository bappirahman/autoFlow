import SignupForm from "@/features/auth/components/signup-form";
import React from "react";

export default function Signup() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full">
      <SignupForm />
    </section>
  );
}
