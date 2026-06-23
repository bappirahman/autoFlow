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
    .min(1, "Webhook URL is required")
    .refine(
      (val) =>
        (val.startsWith("{{") && val.endsWith("}}")) ||
        z.url().safeParse(val).success,
      "Please enter a valid URL or a template expression like {{variable.field}}",
    ),
  content: z.string().min(1, { message: "Content is required" }),
});

export type SlackFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SlackFormValues) => void;
  defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      webhookUrl: defaultValues.webhookUrl || "",
      content: defaultValues.content || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        webhookUrl: defaultValues.webhookUrl || "",
        content: defaultValues.content || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useWatch({
    control: form.control,
    name: "variableName",
    defaultValue: "mySlack",
  });

  const handleSubmit = (values: SlackFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack settings here.
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
                    <Input placeholder="mySlack" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this variable name to reference the result in subsequent
                    nodes, e.g.{" "}
                    <code>{`{{${watchVariableName}.slackMessageSent}}`}</code>.
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
                      placeholder="https://hooks.slack.com/services/..."
                      {...field}
                    />
                  </FormControl>
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <h4 className="font-medium text-sm">
                      How to get your Slack webhook URL
                    </h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>
                        In Slack, go to{" "}
                        <span className="text-foreground font-medium">
                          More → Tools → New → Build workflow
                        </span>
                        .
                      </li>
                      <li>
                        Choose{" "}
                        <span className="text-foreground font-medium">
                          From a webhook
                        </span>{" "}
                        as the trigger.
                      </li>
                      <li>
                        Add a{" "}
                        <span className="text-foreground font-medium">
                          Send a message to a channel
                        </span>{" "}
                        step.
                      </li>
                      <li>
                        In the message field, click{" "}
                        <span className="text-foreground font-medium">
                          Insert a variable
                        </span>{" "}
                        and select{" "}
                        <span className="text-foreground font-mono text-xs">
                          content
                        </span>{" "}
                        from the webhook variables.
                      </li>
                      <li>Copy the webhook URL and paste it above.</li>
                    </ol>
                  </div>
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
                        "Summary: {{myVariable.aiResponse}} or Write a message to Slack saying: {{myVariable.aiResponse}}"
                      }
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The message to send to Slack. You can use template
                    expressions like <code>{`{{variable.field}}`}</code> to
                    include data from previous nodes.
                  </FormDescription>
                  {fieldState.error && (
                    <FieldError className="text-red-500">
                      {fieldState.error.message}
                    </FieldError>
                  )}
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
