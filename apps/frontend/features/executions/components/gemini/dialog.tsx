'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { GEMINI_MODELS } from '@autoflow/shared';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: 'Variable name is required' })
    .regex(
      /^[a-zA-Z_][a-zA-Z0-9_]*$/,
      'Variable name must start with a letter or underscore and contain only letters, numbers, and underscores',
    ),
  model: z.enum(GEMINI_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: 'User prompt is required' }),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || '',
      model: defaultValues.model || GEMINI_MODELS[0],
      systemPrompt: defaultValues.systemPrompt || '',
      userPrompt: defaultValues.userPrompt || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || '',
        model: defaultValues.model || GEMINI_MODELS[0],
        systemPrompt: defaultValues.systemPrompt || '',
        userPrompt: defaultValues.userPrompt || '',
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = useWatch({
    control: form.control,
    name: 'variableName',
    defaultValue: 'myApiCall',
  });

  const handleSubmit = (values: GeminiFormValues) => {
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
                    subsequent nodes, e.g.{' '}
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
              name="model"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GEMINI_MODELS.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the Gemini model you want to use for this node.
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
              name="systemPrompt"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        'You are a helpful assistant that provides concise answers.'
                      }
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The system prompt sets the behavior of the assistant. You
                    can use it to provide instructions, context, or examples to
                    guide the assistant&apos;s responses. Use {'{{variables}}'}{' '}
                    or {'{{json variables}}'} to stringify objects.
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
              name="userPrompt"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        'What is the weather like in New York today? or Summarize the following text: {{myTextVariable}}'
                      }
                      className="min-h-[80px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The user prompt is the message you want to send to the
                    assistant. You can use it to ask questions, request
                    information, or give instructions. Use {'{{variables}}'} or
                    {'{{json variables}}'} to stringify objects.
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
