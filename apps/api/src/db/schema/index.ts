import { user } from './user.schema';
import { session } from './session.schema';
import { account } from './account.schema';
import { verification } from './verification.schema';
import { workflow } from '@/db/schema/workflow.schema';

export { user, session, account, verification, workflow };

export type { User, NewUser } from './user.schema';
export type { Session, NewSession } from './session.schema';
export type { Account, NewAccount } from './account.schema';
export type { Verification, NewVerification } from './verification.schema';
export type { Workflow, NewWorkflow } from './workflow.schema';

export const authSchema = {
  user,
  session,
  account,
  verification,
};
