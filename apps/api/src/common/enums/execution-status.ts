export const ExecutionStatus = Object.freeze({
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const);

export type ExecutionStatusEnum =
  (typeof ExecutionStatus)[keyof typeof ExecutionStatus];
