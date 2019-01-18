import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { verifyJWT } from '../../utils/verifyJWT';

export const onMoveCandidate = (socket: Socket) => async (cid: string, from: number, to: number, token: string) => {
    try {
        verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('moveCandidateError', 'Candidate doesn\'t exist!', 'warning', { cid, to, from });
        }
        const { step, title, group } = candidate;
        if (step !== from) {
            return socket.emit('moveCandidateError', 'Candidate has been moved by others', 'warning', { cid, to, from: step });
        }
        await CandidateRepo.updateById(cid, { step: to });
        socket.broadcast.emit('moveCandidate', cid, from, to);
        socket.emit('moveCandidateSuccess');
        await RecruitmentRepo.update({ title, 'groups.name': group }, {
            [`groups.$.steps.${from}`]: await CandidateRepo.count({ title, group, step: from }),
            [`groups.$.steps.${to}`]: await CandidateRepo.count({ title, group, step: to }),
        });
        return io.emit('updateRecruitment');
    } catch (err) {
        return socket.emit('moveCandidateError', err.message, 'danger', { cid, from, to });
    }
};
