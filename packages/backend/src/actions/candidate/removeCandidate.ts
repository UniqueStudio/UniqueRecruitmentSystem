import { Socket } from 'socket.io';
import { io } from '../../app';
import { CandidateRepo, RecruitmentRepo } from '../../database/model';
import { verifyJWT } from '../../utils/verifyJWT';

import { deleteFile } from '../../utils/deleteFile';

export const onRemoveCandidate = (socket: Socket) => async (cid: string, token: string) => {
    try {
        verifyJWT(token);
        const candidate = await CandidateRepo.queryById(cid);
        if (!candidate) {
            return socket.emit('moveCandidateError', 'Candidate doesn\'t exist!', 'warning', { cid, to, from });
        }
        const { resume, group, title, step } = candidate;
        await deleteFile(resume);
        await CandidateRepo.deleteById(cid);
        await RecruitmentRepo.update({ title, 'groups.name': group }, {
            'groups.$.total': await CandidateRepo.count({ title, group }),
            [`groups.$.steps.${step}`]: await CandidateRepo.count({ title, group, step }),
            'total': await CandidateRepo.count({ title })
        });
        io.emit('removeCandidate', cid);
        io.emit('updateRecruitment');
        return;
    } catch (err) {
        socket.emit('removeCandidateError', err.message, 'danger');
    }
};
