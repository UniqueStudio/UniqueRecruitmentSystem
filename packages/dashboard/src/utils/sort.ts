import { Application } from '@config/types';
import { compareAllocation } from '@utils/comparators';

export const teamSort = (i: Application, j: Application) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};

export const groupSort = (i: Application, j: Application) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};
