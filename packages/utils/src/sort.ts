import { compareAllocation } from './comparators';

import { Application } from '@uniqs/config';

export const teamSort = (i: Application, j: Application) => {
    const l = i.interviewAllocations.team ? new Date(i.interviewAllocations.team) : undefined;
    const r = j.interviewAllocations.team ? new Date(j.interviewAllocations.team) : undefined;
    return compareAllocation(l, r);
};

export const groupSort = (i: Application, j: Application) => {
    const l = i.interviewAllocations.group ? new Date(i.interviewAllocations.group) : undefined;
    const r = j.interviewAllocations.group ? new Date(j.interviewAllocations.group) : undefined;
    return compareAllocation(l, r);
};
