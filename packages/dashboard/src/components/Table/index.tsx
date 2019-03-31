import React, { PureComponent } from 'react';

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

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import DateFnsUtils from '@date-io/date-fns';
import DateTimePicker from 'material-ui-pickers/DateTimePicker/DateTimePickerInline';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import { GROUPS, GROUPS_ } from '../../config/consts';

import Modal from '../Modal';

import { Candidate } from '../../config/types';
import Template from '../../containers/SMS';
import styles from '../../styles/data';

interface Props extends WithStyles<typeof styles> {
    candidates: Candidate[];
    interviewType: 'group' | 'team';
    changeType: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    allocateOne: (cid: string, time: number, type: 'group' | 'team') => void;
    allocateAll: (type: 'group' | 'team') => void;
}

interface State {
    modal: boolean;
    dialog: boolean;
    cid: string;
    viewing: string;
    time: Date;
}

const heads = ['姓名', '组别', '选择情况', '分配结果', '手动调整'];

class CandidateTable extends PureComponent<Props, State> {

    state = {
        modal: false,
        dialog: false,
        cid: '',
        time: new Date(),
        viewing: ''
    };

    allocateOne = () => {
        const { cid, time } = this.state;
        const { allocateOne, interviewType } = this.props;
        allocateOne(cid, time.setMilliseconds(0), interviewType);
    };

    allocateAll = () => {
        const { interviewType, allocateAll } = this.props;
        allocateAll(interviewType);
    };

    toggleDialog = (id: string = '') => () => {
        this.setState({
            dialog: !!id,
            cid: id
        });
    };

    toggleModal = () => {
        this.setState((prevState) => ({
            modal: !prevState.modal
        }));
    };

    toggleViewing = (viewing: string) => () => {
        this.setState({
            viewing
        });
    };

    handleChange = (value: Date) => {
        this.setState({
            time: value,
        });
    };

    render() {
        const { classes, candidates, changeType, interviewType } = this.props;
        const { dialog, time, modal, viewing } = this.state;
        return (
            <Paper className={classes.paper}>
                <div className={classes.data}>
                    <div className={classes.title}>
                        <Typography variant='h6'>
                            <Select
                                value={interviewType}
                                onChange={changeType}
                            >
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
                                    {heads.map((head, index) =>
                                        <TableCell key={index} classes={{ root: classes.tableCell }}>{head}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {candidates.map(({ rejected, abandon, name, group, _id, interviews }) => {
                                    const { selection, allocation } = interviews[interviewType];
                                    const slotInfo = allocation ? new Date(allocation).toLocaleString('zh-CN', { hour12: false }) : '未分配';
                                    const state = <>
                                        <div>{
                                            rejected ? '已淘汰'
                                                : abandon ? '已放弃'
                                                : selection && selection.length ?
                                                    <Button color='primary' onClick={this.toggleViewing(_id)}>查看</Button>
                                                    : '未选择'
                                        }</div>
                                        <Modal open={viewing === _id} onClose={this.toggleViewing('')} title='选择情况'>
                                            {selection.map(({ date, afternoon, morning, evening }, index) =>
                                                <div className={classes.textFieldContainer} key={index}>
                                                    <TextField
                                                        label='日期'
                                                        value={new Date(date).toLocaleDateString('zh-CN', { hour12: false })}
                                                        className={classes.dateSelection}
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
                                            )}
                                        </Modal>
                                    </>;
                                    const button = <Button color='primary' onClick={this.toggleDialog(_id)}>设置</Button>;
                                    const items = [name, GROUPS[GROUPS_.indexOf(group)], state, slotInfo, button];
                                    return (
                                        <TableRow key={_id}>
                                            {items.map((item, index) =>
                                                <TableCell classes={{ root: classes.tableCell }} key={index}>{item}</TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className={classNames(classes.tableButtons, classes.buttonContainer)}>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={this.allocateAll}
                        >自动分配</Button>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={this.toggleModal}
                        >发送短信</Button>
                    </div>
                </div>
                <Dialog open={dialog} onClose={this.toggleDialog()}>
                    <div className={classes.dialog}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                label='选择时间'
                                className={classes.dateSelection}
                                ampm={false}
                                value={time}
                                onChange={this.handleChange}
                                format='yyyy/MM/dd HH:mm'
                            />
                        </MuiPickersUtilsProvider>
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={this.allocateOne}
                            disabled={!time}
                        >确定</Button>
                    </div>
                </Dialog>
                <Modal open={modal} onClose={this.toggleModal} title='发送通知'>
                    <Template
                        toggleOpen={this.toggleModal}
                        selected={candidates}
                    />
                </Modal>
            </Paper>
        );
    }
}

export default withStyles(styles)(CandidateTable);
