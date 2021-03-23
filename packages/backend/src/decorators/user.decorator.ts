import { createParamDecorator } from '@nestjs/common';

import { RequestWithUser } from '@interfaces/request.interface';

export const User = createParamDecorator((_, req: RequestWithUser) => {
    return req.user;
});
