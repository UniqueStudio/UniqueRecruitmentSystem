import { Candidate } from '@config/types';
import { compareAllocation } from '@utils/comparators';

export const teamSort = (i: Candidate, j: Candidate) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};

export const groupSort = (i: Candidate, j: Candidate) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};
