import { Request } from 'express';

import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';

export interface RequestWithIdentity<B = unknown, P = Record<string, string>> extends Request<P, unknown, B> {
    member?: MemberEntity;
    candidate?: CandidateEntity;
}
