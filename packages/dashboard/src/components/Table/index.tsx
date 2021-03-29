import DateFnsUtils from '@date-io/date-fns';
import { Button, Dialog, MenuItem, Paper, Select, Table as MuiTable, Typography } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, MouseEvent, FC, useEffect, useState } from 'react';

import { Body } from './body';
import { Header, OrderBy } from './header';

import { allocateMany, allocateOne } from '@apis/rest';
import { Modal } from '@components/Modal';
import { Template } from '@components/SMS';
import { InterviewType } from '@config/enums';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/data';
import { Order } from '@utils/order';

interface Props {
    candidates: Candidate[];
    type: InterviewType;
    changeType: ChangeEventHandler<{ name?: string; value: unknown }>;
}

export const Table: FC<Props> = observer(({ candidates, changeType, type: type }) => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderBy>('分配结果');
    useEffect(() => {
        $candidate.deselectAll();
    }, []);

    const handleAllocateOne = () => {
        const date = new Date(time);
        date.setSeconds(0, 0);
        return allocateOne(type, cid, date);
    };

    const handleAllocateAll = () => allocateMany(type, [...$candidate.selected.keys()]);

    const toggleDialog = (id = '') => () => {
        setDialog(!!id);
        setCid(id);
    };

    const toggleModal = () => setModal((prevModal) => !prevModal);

    const handleChange = (value: Date | null) => {
        value && setTime(value);
    };

    const handleCheckAll = () => {
        if ($candidate.selected.size === candidates.length) {
            $candidate.deselectAll();
        } else {
            $candidate.selectMany(candidates.map(({ id }) => id));
        }
    };

    const handleRequestSort = (event: MouseEvent<unknown>, property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Paper className={classes.paper}>
            <div className={classes.data}>
                <div className={classes.title}>
                    <Typography variant='h6'>
                        <Select value={type} onChange={changeType}>
                            <MenuItem value='group'>组面</MenuItem>
                            <MenuItem value='team'>群面</MenuItem>
                        </Select>
                        阶段候选人信息
                    </Typography>
                </div>
                <div className={classes.tableContainer}>
                    <MuiTable className={classes.table}>
                        <Header
                            numSelected={$candidate.selected.size}
                            order={order}
                            orderBy={orderBy}
                            onCheckAll={handleCheckAll}
                            onRequestSort={handleRequestSort}
                            rowCount={candidates.length}
                        />
                        <Body
                            order={order}
                            orderBy={orderBy}
                            candidates={candidates}
                            type={type}
                            toggleDialog={toggleDialog}
                        />
                    </MuiTable>
                </div>
                <div className={clsx(classes.tableButtons, classes.buttonContainer)}>
                    <Button color='primary' variant='contained' onClick={handleAllocateAll}>
                        自动分配
                    </Button>
                    <Button color='primary' variant='contained' onClick={toggleModal}>
                        发送短信
                    </Button>
                </div>
            </div>
            <Dialog open={dialog} onClose={toggleDialog()}>
                <div className={classes.dialog}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker
                            label='选择时间'
                            className={classes.dateSelection}
                            ampm={false}
                            value={time}
                            onChange={handleChange}
                            format='yyyy/MM/dd HH:mm'
                        />
                    </MuiPickersUtilsProvider>
                    <Button color='primary' variant='contained' onClick={handleAllocateOne} disabled={!time}>
                        确定
                    </Button>
                </div>
            </Dialog>
            <Modal open={modal} onClose={toggleModal} title='发送通知'>
                <Template toggleOpen={toggleModal} />
            </Modal>
        </Paper>
    );
});
