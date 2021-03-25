import { Request } from 'express';

import { UserEntity } from '@entities/user.entity';

export interface RequestWithUser<B = unknown, P = { [key: string]: string }> extends Request<P, unknown, B> {
    user?: UserEntity;
}
