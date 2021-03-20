import { Candidate } from '../config/types';

export const teamSort = (i: Candidate, j: Candidate) => {
    return sortBySlot(i.interviews.team.allocation, j.interviews.team.allocation);
};

export const groupSort = (i: Candidate, j: Candidate) => {
    return sortBySlot(i.interviews.group.allocation, j.interviews.group.allocation);
};

export const sortBySlot = (iAllocation: number, jAllocation: number) => {
    if (!iAllocation && jAllocation) return 1;
    if (iAllocation && !jAllocation) return -1;
    if (!iAllocation && !jAllocation) return 0;
    return iAllocation - jAllocation;
};
