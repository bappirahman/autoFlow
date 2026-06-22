"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    ),
  webhookUrl: z
    .string()
    .min(1, "Endpoint is required")
    .refine(
      (val) =>
        (val.startsWith("{{") && val.endsWith("}}")) ||
        z.url().safeParse(val).success,
      "Please enter a valid URL or a template expression like {{variable.field}}",
    ),
  content: z.string().min(1, { message: "Content is required" }).max(2000, {
    message: "Discord message must be less than 2000 characters",
  }),
  username: z.string().optional(),
  credentialId: z.string().nullable().optional(),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DiscordFormValues) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<DiscordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      webhookUrl: defaultValues.webhookUrl || "",
      content: defaultValues.content || "",
      username: defaultValues.username || "",
      credentialId: defaultValues.credentialId ?? null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        webhookUrl: defaultValues.webhookUrl || "",
        content: defaultValues.content || "",
        username: defaultValues.username || "",
        credentialId: defaultValues.credentialId ?? null,
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useWatch({
    control: form.control,
    name: "variableName",
    defaultValue: "myApiCall",
  });

  const handleSubmit = (values: DiscordFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gemini</DialogTitle>
          <DialogDescription>
            Configure the Gemini settings here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="myApiCall" {...field} />
                  </FormControl>
                  <FormDescription>
                    use this variable name to reference the response data in
                    subsequent nodes, e.g.{" "}
                    <code>{`{{${watchVariableName}.aiResponse}}`}</code>.
                  </FormDescription>
                  {fieldState.error && (
                    <FieldError className="text-red-500">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get the webhook URL from your Discord channel settings. It
                    should look like{" "}
                    <code>https://discord.com/api/webhooks/...</code> or you can
                    use a template expression like{" "}
                    <code>{`{{variable.field}}`}</code>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        "Summary: {{myVariable.aiResponse}} or Write a message to Discord saying: {{myVariable.aiResponse}}"
                      }
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The message to send to Discord. You can use template
                    expressions like <code>{`{{variable.field}}`}</code> to
                    include data from previous nodes. The message must be less
                    than 2000 characters.
                  </FormDescription>
                  {fieldState.error && (
                    <FieldError className="text-red-500">
                      {fieldState.error.message}
                    </FieldError>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bot Username (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Bot Username" {...field} />
                  </FormControl>
                  <FormDescription>
                    If not set, it will use the default webhook name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
