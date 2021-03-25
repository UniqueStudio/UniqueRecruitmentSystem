import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithIdentity } from '@interfaces/request.interface';

export const Candidate = createParamDecorator(
    (_, context: ExecutionContext) => context.switchToHttp().getRequest<RequestWithIdentity>().candidate,
);
