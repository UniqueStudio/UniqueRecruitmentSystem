import { CandidateEntity } from '@entities/candidate.entity';
import { MemberEntity } from '@entities/member.entity';

export type WsBody<T = Object> = {
    member?: MemberEntity;
    candidate?: CandidateEntity;
} & T;
