import socketIO, { Server } from 'socket.io';

import { onAddComment, onMoveCandidate, onRemoveCandidate, onRemoveComment } from './actions/candidate';
import { messenger } from './actions/user';

import { logger } from './utils/logger';

export const wsServer = <T>(server: T) => socketIO(server);

export const wsHandler = (IOServer: Server) =>
    IOServer.on('connection', (socket) => {
        logger.info('WebSocket connected');
        // move a candidate from step a to step b
        socket.on('moveCandidate', onMoveCandidate(socket));
        // delete a certain candidate
        socket.on('removeCandidate', onRemoveCandidate(socket));
        // comment on a certain candidate
        socket.on('addComment', onAddComment(socket));
        // delete comment on a certain candidate
        socket.on('removeComment', onRemoveComment(socket));
        // instant messenger
        socket.on('sendMessage', messenger(socket));
    });
