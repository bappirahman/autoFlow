"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWebhook } from "@/features/webhooks/hooks/use-webhook";
import { CopyIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
}

export const StripeTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
  const [secretVisible, setSecretVisible] = useState(false);
  const { data: webhook, isLoading } = useWebhook(nodeId, "stripe", open);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const webhookUrl = webhook
    ? `${baseUrl}/webhooks/${webhook.provider}/${webhook.secret}`
    : null;
  const maskedWebhookUrl = webhook
    ? `${baseUrl}/webhooks/${webhook.provider}/${"•".repeat(webhook.secret.length)}`
    : null;

  const copyToClipboard = () => {
    if (!webhookUrl) return;
    try {
      navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy webhook URL to clipboard.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Stripe webhook settings to set up your
            Stripe trigger. Whenever the event occurs, it will send a request to
            this URL to start the workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="webhook-url"
                  value={
                    secretVisible
                      ? (webhookUrl ?? "")
                      : (maskedWebhookUrl ?? "")
                  }
                  readOnly
                  className="font-mono text-sm pr-8"
                  placeholder={isLoading ? "" : "No webhook URL"}
                />
                {isLoading ? (
                  <Loader2Icon className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground animate-spin" />
                ) : (
                  webhookUrl && (
                    <button
                      type="button"
                      onClick={() => setSecretVisible((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {secretVisible ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  )
                )}
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                type="button"
                size="icon"
                disabled={!webhookUrl}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">
              How to connect your Stripe webhook
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard</li>
              <li>Go to Developers → Webhooks</li>
              <li>Click &quot;Add endpoint&quot;</li>
              <li>Paste the webhook URL above</li>
              <li>
                Select events to listen for (e.g., payment_intent.succeeded)
              </li>
              <li>Save and copy the signing secret</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>{" "}
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>{" "}
                - Currency code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>{" "}
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>{" "}
                - Full event data as JSON
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>{" "}
                - Event type (e.g., payment_intent.succeeded)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
