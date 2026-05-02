import { user } from './user.schema';
import { session } from './session.schema';
import { account } from './account.schema';
import { verification } from './verification.schema';
import { workflow } from './workflow.schema';
import { subscription } from './subscription.schema';

export { user, session, account, verification, workflow, subscription };

export * from './node.schema';
export * from './connection.schema';
export * from './credential.schema';
export * from './execution.schema';
export * from './enums/node-type.enum';
export * from './enums/credential-type.enum';
export * from './enums/execution-status.enum';

export type { User, NewUser } from './user.schema';
export type { Session, NewSession } from './session.schema';
export type { Account, NewAccount } from './account.schema';
export type { Verification, NewVerification } from './verification.schema';
export type { Workflow, NewWorkflow } from './workflow.schema';
export type { Subscription, NewSubscription } from './subscription.schema';
export type { Node, NewNode } from './node.schema';
export type { Connection, NewConnection } from './connection.schema';
export type { Credential, NewCredential } from './credential.schema';
export type { Execution, NewExecution } from './execution.schema';

export const authSchema = {
  user,
  session,
  account,
  verification,
};
