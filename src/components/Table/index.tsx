import React, { FC, memo, useMemo, useState } from 'react';

import classNames from 'classnames';

import DateFnsUtils from '@date-io/date-fns';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { DateTimePicker } from '@material-ui/pickers/DateTimePicker/DateTimePicker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';

import Modal from '../Modal';

import { GROUPS, GROUPS_ } from '../../config/consts';

import Template from '../../containers/SMS';
import { Props } from '../../containers/Table';

import { Candidate } from '../../config/types';
import useStyles from '../../styles/data';
import { Order } from '../../utils/order';
import { stableSort } from '../../utils/reducerHelper';
import { EnhancedTableHead, OrderBy } from './header';
import { compareCandidate } from './order';

const CandidateTable: FC<Props> = memo(({ candidates, changeType, interviewType, allocateAll, allocateOne }) => {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    const [viewing, setViewing] = useState('');
    const [checked, setChecked] = useState(() => Object.fromEntries(candidates.map((c) => [c._id, false])));
    const checkedCount = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);
    const allChecked = useMemo(() => Object.fromEntries(candidates.map(({ _id }) => [_id, true])), [candidates]);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<OrderBy>('分配结果');

    const handleAllocateOne = () => {
        allocateOne(cid, time.setMilliseconds(0), interviewType);
    };

    const handleAllocateAll = () => {
        allocateAll(interviewType);
    };

    const toggleDialog = (id: string = '') => () => {
        setDialog(!!id);
        setCid(id);
    };

    const toggleModal = () => {
        setModal((prevModal) => !prevModal);
    };

    const toggleViewing = (nextViewing: string) => () => {
        setViewing(nextViewing);
    };

    const handleChange = (value: Date | null) => {
        value && setTime(value);
    };

    const handleCheck = (id: string = '') => (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked((prev) => ({ ...prev, [id]: event.target.checked }));
    };

    const handleCheckAll = () => {
        if (checkedCount === candidates.length) {
            setChecked({});
        } else {
            setChecked(allChecked);
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
                            numSelected={checkedCount}
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
                                    const items = [name, GROUPS[GROUPS_.indexOf(group)], state, slotInfo, button];
                                    return (
                                        <TableRow key={_id}>
                                            <TableCell classes={{ root: classes.tableCell }} padding='checkbox'>
                                                {/* `|| false` deal with undefined, which React think it's a uncontrolled component */}
                                                <Checkbox checked={checked[_id] || false} onChange={handleCheck(_id)} />
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
                <div className={classNames(classes.tableButtons, classes.buttonContainer)}>
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
                <Template toggleOpen={toggleModal} selected={candidates.filter(({ _id }) => checked[_id])} />
            </Modal>
        </Paper>
    );
});

export default CandidateTable;
