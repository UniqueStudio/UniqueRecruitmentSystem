import { Checkbox, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import React, { ChangeEvent, FC, MouseEvent } from 'react';

import useStyles from '@styles/data';
import { Order } from '@utils/order';

const sortableHeads = ['姓名', '组别', '分配结果'] as const;
const otherHeads = ['选择情况', '手动调整'] as const;

export type OrderBy = typeof sortableHeads[number];

interface Props {
    numSelected: number;
    onRequestSort: (event: MouseEvent<unknown>, property: OrderBy) => void;
    onCheckAll: (event: ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: OrderBy;
    rowCount: number;
}

export const Header: FC<Props> = ({ onCheckAll, order, orderBy, numSelected, rowCount, onRequestSort }) => {
    const classes = useStyles();

    const createSortHandler = (property: OrderBy) => (event: React.MouseEvent<HTMLSpanElement>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell classes={{ root: classes.tableCell }} padding='checkbox'>
                    <Checkbox
                        disabled={rowCount === 0}
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onCheckAll}
                    />
                </TableCell>
                {sortableHeads.map((headCell) => (
                    <TableCell
                        key={headCell}
                        classes={{ root: classes.tableCell }}
                        sortDirection={orderBy === headCell ? order : false}>
                        <TableSortLabel
                            active={orderBy === headCell}
                            direction={orderBy === headCell ? order : 'asc'}
                            onClick={createSortHandler(headCell)}>
                            {headCell}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {otherHeads.map((headCell) => (
                    <TableCell key={headCell} classes={{ root: classes.tableCell }}>
                        {headCell}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};
