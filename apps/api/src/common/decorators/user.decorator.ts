import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

type RequestUser = NonNullable<Request['user']>;
type UserField = keyof RequestUser;

export const User = createParamDecorator(
  (data: UserField | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!data) {
      return user;
    }

    return user?.[data];
  },
);
