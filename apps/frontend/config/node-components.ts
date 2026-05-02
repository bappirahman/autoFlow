import { InitialNode } from '@/components/initial-node';
import { NodeType } from '@autoflow/shared';
import type { NodeTypes } from '@xyflow/react';

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents;
