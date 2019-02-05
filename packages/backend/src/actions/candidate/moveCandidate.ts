import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { errorRes } from '../../utils/errorRes';
import { logger } from '../../utils/logger';
import { verifyJWT } from '../../utils/verifyJWT';

export const onMoveCandidate = (socket: Socket) => async (req: { cid: string, from: number, to: number, token: string }) => {
    const { cid, from, to, token } = req;
    try {
        verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('moveCandidateError', errorRes('Candidate doesn\'t exist!', 'warning', { cid, to, from }));
        }
        const { step, title, group } = candidate;
        const recruitment = (await RecruitmentRepo.query({ title }))[0];
        if (recruitment.end < Date.now()) {
            return socket.emit('moveCandidateError', errorRes('This recruitment has already ended!', 'warning', { cid, to, from }));
        }
        if (step !== from) {
            return socket.emit('moveCandidateError', errorRes('Candidate has been moved by others', 'warning', { cid, to, from: step }));
        }
        await CandidateRepo.updateById(cid, { step: to });
        socket.broadcast.emit('moveCandidate', { cid, from, to, title });
        socket.emit('moveCandidateSuccess');
        await RecruitmentRepo.update({ title, 'groups.name': group }, {
            [`groups.$.steps.${from}`]: await CandidateRepo.count({ title, group, step: from }),
            [`groups.$.steps.${to}`]: await CandidateRepo.count({ title, group, step: to }),
        });
        return io.emit('updateRecruitment');
    } catch ({ message }) {
        logger.error(message);
        return socket.emit('moveCandidateError', errorRes(message, 'error', { cid, from, to }));
    }
};
