import io from 'socket.io-client';
import { URL } from '../lib/const';

export const socket = io(URL);

