import { Request } from 'express';

import { CandidateEntity } from '@entities/candidate.entity';
import { UserEntity } from '@entities/user.entity';

export interface RequestWithIdentity<B = unknown, P = { [key: string]: string }> extends Request<P, unknown, B> {
    user?: UserEntity;
    candidate?: CandidateEntity;
}
