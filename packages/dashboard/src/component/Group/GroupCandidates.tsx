import React, { PureComponent } from 'react';

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

import styles from '../../style/group';

import { Candidate } from '../../lib/const';
import { sortBySlot } from '../../lib/sortBySlot';
import timeStampToString from '../../lib/timeStampToString';

interface Props extends WithStyles {
    candidates: Candidate[];
    interviewStage: number;
    disabled: boolean;
    handleChange: (event: React.ChangeEvent) => void;
    toggleDialog: () => void;
    toggleModal: () => void;
    setTime: (id: string, time: string) => void;
}

const heads = ['姓名', '组别', '选择情况', '分配结果', '手动调整'];

class Candidates extends PureComponent<Props> {

    state = {
        dialogOpen: '',
        time: timeStampToString(+new Date(), 16),
    };

    toggleDialog = (id: string = '') => () => {
        this.setState({
            dialogOpen: id,
            time: id ? this.state.time : timeStampToString(+new Date(), 16),
        });
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({
            time: event.target['value'],
        });
    };

    setTime = () => {
        const { dialogOpen, time } = this.state;
        this.props.setTime(dialogOpen, time);
    };

    render() {
        const { classes, candidates, disabled, interviewStage, handleChange, toggleDialog, toggleModal } = this.props;
        const { dialogOpen, time } = this.state;
        const sorted = candidates && candidates.sort(sortBySlot(interviewStage));
        return (
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <div />
                    <Typography variant='title'>
                        候选人信息
                    </Typography>
                    <Select
                        value={interviewStage}
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>组面</MenuItem>
                        <MenuItem value={2}>群面</MenuItem>
                    </Select>
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
                            {sorted && sorted.map((candidate, index) => {
                                const { rejected, abandon, name, _id, group } = candidate;
                                const timeChosen = candidate[`time${interviewStage}`];
                                const slot = candidate[`slot${interviewStage}`];
                                const slotInfo = slot && slot.length ? `${slot[0]}-${slot[2]}` : '未分配';
                                const state = rejected ? '已淘汰' : abandon ? '已放弃' : timeChosen && timeChosen.length ? '已选择' : '未选择';
                                const set = <Button color='primary' onClick={this.toggleDialog(_id)}>设置</Button>;
                                const items = [name, group, state, slotInfo, set];
                                return (
                                    <TableRow key={index}>
                                        {items.map((item, idx) =>
                                            <TableCell classes={{ root: classes.tableCell }} key={idx}>{item}</TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
                <div className={classes.buttonContainer}>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={toggleModal}
                        className={classes.button}
                        disabled={disabled}
                    >分配时间</Button>
                    <Button
                        color='primary'
                        variant='contained'
                        className={classes.button}
                        disabled={disabled}
                        onClick={toggleDialog}
                    >发送短信</Button>
                </div>
                <Dialog open={!!dialogOpen} onClose={this.toggleDialog()}>
                    <div className={classes.dialog}>
                        <TextField
                            id='datetime-local'
                            label={interviewStage === 1 ? '组面时间' : '群面时间'}
                            type='datetime-local'
                            value={time}
                            InputLabelProps={{ shrink: true }}
                            onChange={this.handleChange}
                            className={classes.timeSelect}
                        />
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={this.setTime}
                            disabled={!time}
                        >确定</Button>
                    </div>
                </Dialog>
            </Paper>
        );
    }
}

export default withStyles(styles)(Candidates);
