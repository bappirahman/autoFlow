import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzleDb } from '../db';
import { authSchema } from '../db/schema';

export const auth = betterAuth({
  database: drizzleAdapter(drizzleDb, {
    provider: 'pg',
    schema: authSchema,
  }),
  baseUrl: 'http://localhost:3000',
  trustedOrigins: [process.env.CORS_URL!],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
