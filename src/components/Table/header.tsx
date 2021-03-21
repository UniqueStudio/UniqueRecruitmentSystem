import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { Order } from '../../utils/order';

const sortableHeads = ['姓名', '组别', '分配结果'] as const;
const otherHeads = ['选择情况', '手动调整'] as const;

export type OrderBy = typeof sortableHeads[number];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: OrderBy) => void;
    onCheckAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: OrderBy;
    rowCount: number;
}

export const EnhancedTableHead: React.FC<EnhancedTableProps> = ({
    onCheckAll,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
}) => {
    const createSortHandler = (property: OrderBy) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding='checkbox'>
                    <Checkbox
                        disabled={rowCount === 0}
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onCheckAll}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {sortableHeads.map((headCell) => (
                    <TableCell key={headCell} sortDirection={orderBy === headCell ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell}
                            direction={orderBy === headCell ? order : 'asc'}
                            onClick={createSortHandler(headCell)}>
                            {headCell}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {otherHeads.map((headCell) => (
                    <TableCell key={headCell}>{headCell}</TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
