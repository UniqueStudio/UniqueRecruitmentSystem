import { Candidate } from '@config/types';

export const sortByAllocation = (a?: Date, b?: Date) => {
    return a ? (b ? +a - +b : -1) : b ? 1 : 0;
};

export const teamSort = (i: Candidate, j: Candidate) => {
    return sortByAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};

export const groupSort = (i: Candidate, j: Candidate) => {
    return sortByAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};
