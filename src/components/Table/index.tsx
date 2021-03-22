import DateFnsUtils from '@date-io/date-fns';
import {
    Button,
    Checkbox,
    Dialog,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';

import { EnhancedTableHead, OrderBy } from './header';
import { compareCandidate } from './order';

import { allocateAll, allocateOne } from '@apis/rest';
import Modal from '@components/Modal';
import Template from '@components/SMS';
import { GROUPS, GROUPS_ } from '@config/consts';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/data';
import { Order } from '@utils/order';
import { stableSort } from '@utils/reducerHelper';

interface Props {
    candidates: Candidate[];
    interviewType: 'group' | 'team';
    changeType: ChangeEventHandler<{ name?: string; value: unknown }>;
}

const CandidateTable: FC<Props> = observer(({ candidates, changeType, interviewType }) => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    const [viewing, setViewing] = useState('');
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderBy>('分配结果');
    useEffect(() => {
        $candidate.deselectAll();
    }, []);

    const handleAllocateOne = () => allocateOne(interviewType, cid, time.setMilliseconds(0));

    const handleAllocateAll = () => allocateAll(interviewType);

    const toggleDialog = (id = '') => () => {
        setDialog(!!id);
        setCid(id);
    };

    const toggleModal = () => setModal((prevModal) => !prevModal);

    const toggleViewing = (nextViewing: string) => () => {
        setViewing(nextViewing);
    };

    const handleChange = (value: Date | null) => {
        value && setTime(value);
    };

    const handleCheck = (id = '') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            $candidate.selectCandidate(id);
        } else {
            $candidate.deselectCandidate(id);
        }
    };

    const handleCheckAll = () => {
        if ($candidate.selected.size === candidates.length) {
            $candidate.deselectAll();
        } else {
            $candidate.selectCandidates(candidates.map(({ _id }) => _id));
        }
    };

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Paper className={classes.paper}>
            <div className={classes.data}>
                <div className={classes.title}>
                    <Typography variant='h6'>
                        <Select value={interviewType} onChange={changeType}>
                            <MenuItem value='group'>组面</MenuItem>
                            <MenuItem value='team'>群面</MenuItem>
                        </Select>
                        阶段候选人信息
                    </Typography>
                </div>
                <div className={classes.tableContainer}>
                    <Table className={classes.table}>
                        <EnhancedTableHead
                            numSelected={$candidate.selected.size}
                            order={order}
                            orderBy={orderBy}
                            onCheckAll={handleCheckAll}
                            onRequestSort={handleRequestSort}
                            rowCount={candidates.length}
                        />
                        <TableBody>
                            {stableSort<Candidate>(candidates, compareCandidate(order, orderBy)).map(
                                ({ rejected, abandon, name, group, _id, interviews }) => {
                                    const { selection, allocation } = interviews[interviewType];
                                    const slotInfo = allocation
                                        ? new Date(allocation).toLocaleString('ja-JP', { hour12: false })
                                        : '未分配';
                                    const state = (
                                        <>
                                            <div>
                                                {rejected ? (
                                                    '已淘汰'
                                                ) : abandon ? (
                                                    '已放弃'
                                                ) : selection && selection.length ? (
                                                    <Button color='primary' onClick={toggleViewing(_id)}>
                                                        查看
                                                    </Button>
                                                ) : (
                                                    '未选择'
                                                )}
                                            </div>
                                            <Modal open={viewing === _id} onClose={toggleViewing('')} title='选择情况'>
                                                {selection.map(({ date, afternoon, morning, evening }, index) => (
                                                    <div className={classes.textFieldContainer} key={index}>
                                                        <TextField
                                                            label='日期'
                                                            value={new Date(date).toLocaleDateString('zh-CN', {
                                                                hour12: false,
                                                            })}
                                                            className={classes.datePicker}
                                                        />
                                                        <TextField
                                                            label='上午'
                                                            value={morning ? '是' : '否'}
                                                            className={classes.textField}
                                                        />
                                                        <TextField
                                                            label='下午'
                                                            value={afternoon ? '是' : '否'}
                                                            className={classes.textField}
                                                        />
                                                        <TextField
                                                            label='晚上'
                                                            value={evening ? '是' : '否'}
                                                            className={classes.textField}
                                                        />
                                                    </div>
                                                ))}
                                            </Modal>
                                        </>
                                    );
                                    const button = (
                                        <Button variant='contained' color='primary' onClick={toggleDialog(_id)}>
                                            设置
                                        </Button>
                                    );
                                    const items = [name, GROUPS[GROUPS_.indexOf(group)], slotInfo, state, button];
                                    return (
                                        <TableRow key={_id}>
                                            <TableCell classes={{ root: classes.tableCell }} padding='checkbox'>
                                                <Checkbox
                                                    checked={$candidate.selected.has(_id)}
                                                    onChange={handleCheck(_id)}
                                                />
                                            </TableCell>
                                            {items.map((item, index) => (
                                                <TableCell classes={{ root: classes.tableCell }} key={index}>
                                                    {item}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                },
                            )}
                        </TableBody>
                    </Table>
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

export default CandidateTable;
