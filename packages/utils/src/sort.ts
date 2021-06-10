import { compareAllocation } from './comparators';

import { Application } from '#config/types';

export const teamSort = (i: Application, j: Application) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};

export const groupSort = (i: Application, j: Application) => {
    return compareAllocation(i.interviewAllocations.group, j.interviewAllocations.group);
};
