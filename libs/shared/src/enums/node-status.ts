export const NodeStatus = Object.freeze({
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const);

export type NodeStatusEnum = (typeof NodeStatus)[keyof typeof NodeStatus];
