import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '@interfaces/request.interface';

export const User = createParamDecorator(
    (_, context: ExecutionContext) => context.switchToHttp().getRequest<RequestWithUser>().user,
);
