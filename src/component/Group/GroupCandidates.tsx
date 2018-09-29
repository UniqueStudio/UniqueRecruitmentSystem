import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/group';
import withRoot from "../../style/withRoot";
import { Candidate } from '../../lib/const';
import timeStampToString from "../../lib/timeStampToString";

interface Props extends WithStyles {
    candidates: Candidate[];
    interviewStage: number;
    disabled: boolean;
    handleChange: (event: React.ChangeEvent) => void;
    toggleDialog: () => void;
    toggleModal: () => void;
    setTime: (id: string, time: string) => void;
}

class Candidates extends PureComponent<Props> {

    state = {
        dialogOpen: '',
        time: timeStampToString(+new Date(), 16)
    };

    toggleDialog = (id: string = '') => () => {
        this.setState({
            dialogOpen: id,
            time: id ? this.state.time : timeStampToString(+new Date(), 16)
        })
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({
            time: event.target['value']
        })
    };

    setTime = () => {
        const { dialogOpen, time } = this.state;
        this.props.setTime(dialogOpen, time);
    };

    render() {
        const { classes, candidates, disabled, interviewStage, handleChange, toggleDialog, toggleModal } = this.props;
        const { dialogOpen, time } = this.state;
        return (
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <div/>
                    <Typography variant="title">
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
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell classes={{
                                root: classes.tableCell
                            }}>姓名</TableCell>
                            <TableCell classes={{
                                root: classes.tableCell
                            }}>选择情况</TableCell>
                            <TableCell classes={{
                                root: classes.tableCell
                            }}>分配结果</TableCell>
                            <TableCell classes={{
                                root: classes.tableCell
                            }}/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Boolean(candidates.length) && candidates.map((i, j) => {
                            const time = i[`time${interviewStage}`];
                            const slot = i[`slot${interviewStage}`];
                            const state = i.rejected ? '已淘汰' : i.abandon ? '已放弃' : time && time.length ? '已选择' : '未选择';
                            return (
                                <TableRow key={j}>
                                    <TableCell component="th" scope="row"
                                               classes={{ root: classes.tableCell }}>{i.name}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>{state}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>{slot && slot.length ? `${slot[0]}-${slot[2]}` : '未分配'}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>
                                        <Button color='primary' onClick={this.toggleDialog(i._id)}>设置</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
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
                            id="datetime-local"
                            label={interviewStage === 1 ? '组面时间' : '群面时间'}
                            type="datetime-local"
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
        )
    }
}

export default withRoot(withStyles(styles)(Candidates));