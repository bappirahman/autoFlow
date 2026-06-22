"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCredential } from "@/features/credentials/hooks/use-credentials";
import type { CredentialType } from "@/features/credentials/types/credential";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CREDENTIAL_TYPES: { value: CredentialType; label: string }[] = [
  { value: "OPENAI", label: "OpenAI" },
  { value: "ANTHROPIC", label: "Anthropic" },
  { value: "GEMINI", label: "Gemini" },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["OPENAI", "ANTHROPIC", "GEMINI"] as [
    CredentialType,
    ...CredentialType[],
  ]),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const CredentialForm = () => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const { handleError, modal } = useUpgradeModal();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "OPENAI",
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createCredential.mutateAsync(values);
      router.push("/credentials");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Create Credential</CardTitle>
          <CardDescription>
            Add a new API key to connect an AI provider to your workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My OpenAI Key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CREDENTIAL_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="sk-..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={createCredential.isPending}>
                  {createCredential.isPending
                    ? "Creating..."
                    : "Create credential"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/credentials" prefetch>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
