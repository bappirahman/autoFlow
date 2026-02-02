"use client";

import { Github } from "@/components/icons/github";
import { Google } from "@/components/icons/google";
import { Logo } from "@/components/icons/logo";
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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;
  return (
    <section className="flex flex-col gap-6 w-full max-w-md px-4">
      <Card>
        <CardHeader className="text-center">
          <Logo className="h-20 w-20 mx-auto" />
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="email" className="font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel htmlFor="password" className="font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                  <Button disabled={isPending} className="w-full" type="submit">
                    {isPending ? "Logging in..." : "Login"}
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    disabled={isPending}
                    className="w-full"
                    type="button"
                  >
                    <Google />
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isPending}
                    className="w-full"
                    type="button"
                  >
                    <Github />
                    Continue with Github
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?
                  <Link href="/signup" className="text-primary underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
