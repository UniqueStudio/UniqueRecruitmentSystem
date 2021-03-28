import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithIdentity } from '@interfaces/request.interface';

export const User = createParamDecorator(
    (_, context: ExecutionContext) => context.switchToHttp().getRequest<RequestWithIdentity>().user,
);
