import { Candidate } from './const';

export const sortBySlot = (stage: number) => (i: Candidate, j: Candidate) => {
    const iSlot = i[`slot${stage}`];
    const jSlot = j[`slot${stage}`];
    if (!iSlot && jSlot) return 1;
    if (iSlot && !jSlot) return -1;
    if (!iSlot && !jSlot) return 0;
    const [iDate, , iTime] = iSlot;
    const [jDate, , jTime] = jSlot;
    return iDate > jDate ? 1 : iDate < jDate ? -1 : iTime > jTime ? 1 : iTime < jTime ? -1 : 0;
};
