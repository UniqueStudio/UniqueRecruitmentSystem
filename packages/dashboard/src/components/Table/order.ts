import { OrderBy } from './header';

import { getComparator, Order } from '@utils/order';
// import { groupSort, groupSortDesc } from '@utils/sortBySlot';

export const compareCandidate = (order: Order, orderBy: OrderBy) => {
    switch (orderBy) {
        // case '分配结果':
        // return order === 'asc' ? groupSort : groupSortDesc;
        case '姓名':
            return getComparator(order, 'name');
        case '组别':
            return getComparator(order, 'group');
        default:
            return () => 1;
    }
};
