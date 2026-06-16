'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateGoogleFormScript } from '@/features/trigger/components/google-form-trigger/utils';
import { useWebhook } from '@/features/webhooks/hooks/use-webhook';
import { CopyIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange, nodeId }: Props) => {
  const [secretVisible, setSecretVisible] = useState(false);
  const { data: webhook, isLoading } = useWebhook(nodeId, 'google_form', open);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const webhookUrl = webhook
    ? `${baseUrl}/webhooks/${webhook.provider}/${webhook.secret}`
    : null;
  const maskedWebhookUrl = webhook
    ? `${baseUrl}/webhooks/${webhook.provider}/${'•'.repeat(webhook.secret.length)}`
    : null;

  const copyToClipboard = () => {
    if (!webhookUrl) return;
    try {
      navigator.clipboard.writeText(webhookUrl);
      toast.success('Webhook URL copied to clipboard');
    } catch {
      toast.error('Failed to copy webhook URL to clipboard.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps Script to set
            up your Google Form trigger. Whenever the form is submitted, it will
            send a request to this URL to start the workflow.
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
                      ? (webhookUrl ?? '')
                      : (maskedWebhookUrl ?? '')
                  }
                  readOnly
                  className="font-mono text-sm pr-8"
                  placeholder={isLoading ? '' : 'No webhook URL'}
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
              How to connect your Google Form
            </h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy the webhook URL above and open your Google Form.</li>
              <li>
                Go to{' '}
                <span className="text-foreground font-medium">
                  Extensions → Apps Script
                </span>
                .
              </li>
              <li>
                In the script editor, call{' '}
                <span className="text-foreground font-mono text-xs">
                  UrlFetchApp.fetch()
                </span>{' '}
                with the webhook URL on form submit.
              </li>
              <li>
                Save the script, then add an{' '}
                <span className="text-foreground font-medium">
                  On form submit
                </span>{' '}
                trigger from the Triggers menu.
              </li>
              <li>Submit the form once to verify the workflow starts.</li>
            </ol>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">Google Apps Script:</h4>
            <Button
              type="button"
              variant="outline"
              disabled={!webhookUrl}
              onClick={async () => {
                if (!webhookUrl) return;
                const script = generateGoogleFormScript(webhookUrl);
                try {
                  await navigator.clipboard.writeText(script);
                  toast.success('Script copied to clipboard');
                } catch {
                  toast.error('Failed to copy Script to clipboard');
                }
              }}
            >
              <CopyIcon className="size-4 mr-2" />
              Copy Google Apps Script
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {'{{googleForm.respondentEmail}}'}
                </code>
                - Respondent&apos;s email
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                - Specific answer
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {'{{json googleForm.responses}}'}
                </code>{' '}
                - All responses as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
