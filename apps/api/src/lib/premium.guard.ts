import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ user?: { plan: string; subscriptionStatus: string } }>();
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Not authenticated');
    }

    const isPro = user.plan === 'pro' && user.subscriptionStatus === 'active';

    if (!isPro) {
      throw new ForbiddenException('Premium subscription required');
    }

    return true;
  }
}
