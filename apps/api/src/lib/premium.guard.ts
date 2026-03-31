import { DRIZZLE_INJECTION_TOKEN } from '@/db';
import * as schema from '@/db/schema';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres/driver';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(
    @Inject(DRIZZLE_INJECTION_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user?: unknown }>();
    const user = req.user as { id?: string } | undefined;

    if (!user || !user.id) {
      throw new UnauthorizedException('Not authenticated');
    }

    const [dbUser] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, user.id));

    if (!dbUser) {
      throw new UnauthorizedException('Not authenticated');
    }

    const isPro =
      dbUser.plan === 'pro' && dbUser.subscriptionStatus === 'active';
    if (!isPro) {
      throw new HttpException(
        'Premium subscription required',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }
}
