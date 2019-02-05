import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { deleteFile } from '../../utils/deleteFile';
import { errorRes } from '../../utils/errorRes';
import { logger } from '../../utils/logger';
import { verifyJWT } from '../../utils/verifyJWT';

export const onRemoveCandidate = (socket: Socket) => async ({ cid, token }: { cid: string, token: string }) => {
    try {
        verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('removeCandidateError', errorRes('Candidate doesn\'t exist!', 'warning'));
        }
        const { resume, group, title, step } = candidate;
        const recruitment = (await RecruitmentRepo.query({ title }))[0];
        if (!recruitment) {
            return socket.emit('removeCandidateError', errorRes('Recruitment doesn\'t exist!', 'warning'));
        }
        if (recruitment.end < Date.now()) {
            return socket.emit('removeCandidateError', errorRes('This recruitment has already ended!', 'warning'));
        }
        await deleteFile(resume);
        await CandidateRepo.deleteById(cid);
        await RecruitmentRepo.update({ title, 'groups.name': group }, {
            'groups.$.total': await CandidateRepo.count({ title, group }),
            [`groups.$.steps.${step}`]: await CandidateRepo.count({ title, group, step }),
            'total': await CandidateRepo.count({ title })
        });
        io.emit('removeCandidate', { cid, title });
        io.emit('updateRecruitment');
        return;
    } catch ({ message }) {
        logger.error(message);
        return socket.emit('removeCandidateError', errorRes(message, 'error'));
    }
};
