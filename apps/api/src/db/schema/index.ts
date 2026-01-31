import { user } from './user.schema';
import { session } from './session.schema';
import { account } from './account.schema';
import { verification } from './verification.schema';

export { user, session, account, verification };

export const authSchema = {
  user,
  session,
  account,
  verification,
};
