import { sendMessageEpic } from './sendMessage';
import { sendImageEpic } from './sendImage';

export default [sendMessageEpic, sendImageEpic];