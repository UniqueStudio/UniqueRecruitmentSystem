import React, { FC, memo, useState } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import DatePicker from '../DatePicker';
import Modal from '../Modal';

import { GROUPS, GROUPS_ } from '../../config/consts';

import Template from '../../containers/SMS';
import { Props } from '../../containers/Table';

import useStyles from '../../styles/data';

const heads = ['姓名', '组别', '选择情况', '分配结果', '手动调整'];

const CandidateTable: FC<Props> = memo(({ candidates, changeType, interviewType, allocateAll, allocateOne }) => {
    const classes = useStyles();
    const [modal, setModal] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    const [viewing, setViewing] = useState('');

    const handleAllocateOne = () => {
        allocateOne(cid, time.setMilliseconds(0), interviewType);
    };

    const handleAllocateAll = () => {
        allocateAll(interviewType);
    };

    const toggleDialog = (id = '') => () => {
        setDialog(!!id);
        setCid(id);
    };

    const toggleModal = () => {
        setModal((prevModal) => !prevModal);
    };

    const toggleViewing = (nextViewing: string) => () => {
        setViewing(nextViewing);
    };

    const handleChange = (value: unknown) => {
        value && setTime(value as Date);
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
                        <TableHead>
                            <TableRow>
                                {heads.map((head, index) => (
                                    <TableCell key={index} classes={{ root: classes.tableCell }}>{head}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.map(({ rejected, abandon, name, group, _id, interviews }) => {
                                const { selection, allocation } = interviews[interviewType];
                                const slotInfo = allocation ? new Date(allocation).toLocaleString('zh-CN', { hour12: false }) : '未分配';
                                const state = <>
                                    <div>
                                        {rejected ? '已淘汰'
                                            : abandon ? '已放弃'
                                                : selection && selection.length ? <Button color='primary' onClick={toggleViewing(_id)}>查看</Button>
                                                    : '未选择'}
                                    </div>
                                    <Modal open={viewing === _id} onClose={toggleViewing('')} title='选择情况'>
                                        {selection.map(({ date, afternoon, morning, evening }, index) => (
                                            <div className={classes.textFieldContainer} key={index}>
                                                <TextField
                                                    label='日期'
                                                    value={new Date(date).toLocaleDateString('zh-CN', { hour12: false })}
                                                    className={classes.datePicker}
                                                />
                                                <TextField label='上午' value={morning ? '是' : '否'} className={classes.textField} />
                                                <TextField label='下午' value={afternoon ? '是' : '否'} className={classes.textField} />
                                                <TextField label='晚上' value={evening ? '是' : '否'} className={classes.textField} />
                                            </div>
                                        ))}
                                    </Modal>
                                </>;
                                const button = <Button color='primary' onClick={toggleDialog(_id)}>设置</Button>;
                                const items = [name, GROUPS[GROUPS_.indexOf(group)], state, slotInfo, button];
                                return (
                                    <TableRow key={_id}>
                                        {items.map((item, index) => (
                                            <TableCell classes={{ root: classes.tableCell }} key={index}>{item}</TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className={classNames(classes.tableButtons, classes.buttonContainer)}>
                    <Button color='primary' variant='contained' onClick={handleAllocateAll}>自动分配</Button>
                    <Button color='primary' variant='contained' onClick={toggleModal}>发送短信</Button>
                </div>
            </div>
            <Dialog open={dialog} onClose={toggleDialog()}>
                <div className={classes.dialog}>
                    <DatePicker
                        label='选择时间'
                        value={time}
                        onChange={handleChange}
                        className={classes.dateSelection}
                    />
                    <Button color='primary' variant='contained' onClick={handleAllocateOne} disabled={!time}>确定</Button>
                </div>
            </Dialog>
            <Modal open={modal} onClose={toggleModal} title='发送通知'>
                <Template toggleOpen={toggleModal} selected={candidates} />
            </Modal>
        </Paper>
    );
});

export default CandidateTable;
