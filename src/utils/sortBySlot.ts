import { Candidate } from 'Config/types';

export default (i: Candidate, j: Candidate) => {
    const iAllocation = i.interviews.team.allocation;
    const jAllocation = j.interviews.team.allocation;
    if (!iAllocation && jAllocation) return 1;
    if (iAllocation && !jAllocation) return -1;
    if (!iAllocation && !jAllocation) return 0;
    return iAllocation - jAllocation;
};
