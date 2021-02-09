import { HOST } from 'config/consts';
import { MessageType } from 'config/types';

const prefix = 'recruitment';

export interface GetPendingTitlesResp {
  type: MessageType;
  data?: string[];
  message?: string;
}

export const getPendingTitles = async () => {
  const resp = await fetch(`${HOST}/${prefix}/pending`);
  const result: GetPendingTitlesResp = await resp.json();
  return result;
};
