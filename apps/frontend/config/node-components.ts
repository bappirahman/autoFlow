import { InitialNode } from '@/components/initial-node';
import { GeminiNode } from '@/features/executions/components/gemini/node';
import { HttpRequestNode } from '@/features/executions/components/http-request/node';
import { GoogleFormTriggerNode } from '@/features/trigger/components/google-form-trigger/node';
import { ManualTriggerNode } from '@/features/trigger/components/manual-trigger/node';
import { StripeTriggerNode } from '@/features/trigger/components/stripe-trigger/node';
import { NodeType } from '@autoflow/shared';
import type { NodeTypes } from '@xyflow/react';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents;
