import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
import Modal from '../Modal';
import Verify from '../../container/Verify';
import { Candidate, Recruitment, Time, User } from '../../lib/const';

interface Props extends WithStyles {
    candidates: Map<string, Candidate>[];
    group: User[];
    userInfo: object;
    currentRecruitment: Recruitment;
    requestCandidate: (group: string) => void;
    requestGroup: (group: string) => void;
    requestRecruitments: () => void;
    sendInterview: (content: object) => void;
    toggleSnackbar: (message: string, color: string) => void;
    submit: (title: string, slots: number[], group: string) => void;
}

class Group extends PureComponent<Props> {

    state = {
        step: 1,
        numbers: [] as number[][],
        modalOpen: false,
        dialogOpen: false,
        code: ''
    };

    groupName = this.props.userInfo['group'];

    initTime = (time: Time[]) => {
        if (!time) {
            this.props.toggleSnackbar('请先设置面试时间！', 'info');
            return;
        }
        this.setState({
            numbers: time.map(i =>
                [i.morning ? 0 : -1, i.afternoon ? 0 : -1, i.evening ? 0 : -1]
            )
        })
    };
    handleChange = (event: React.ChangeEvent) => {
        const step = event.target['value'];
        const { requestCandidate } = this.props;
        const group = this.groupName;
        this.setState({
            step
        });
        step === 1 ? requestCandidate(group) : requestCandidate('interview');

    };
    handleSelect = (i: number, j: number) => (event: React.ChangeEvent) => {
        const numbers = [...this.state.numbers];
        numbers[i] = numbers[i] || [];
        numbers[i][j] = Math.max(event.target['value'], 1);
        this.setState({
            numbers
        })
    };
    handleInput = (event: React.ChangeEvent) => {
        this.setState({
            code: event.target['value'],
        });
    };
    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    };
    toggleDialog = () => {
        this.setState({
            dialogOpen: !this.state.dialogOpen
        })
    };
    submitArrange = () => {
        const { toggleSnackbar, candidates, currentRecruitment, submit } = this.props;
        const { numbers, step } = this.state;
        const candidateNumbers = candidates.map(i => [...i.values()])[step === 1 ? 2 : 4].filter(i => !i.abandon).length;
        let total = 0;
        let message = '';
        numbers.map(i => {
            i.map(j => {
                if (j === 0) {
                    message = '每个时间段必须分配候选人';
                    return;
                } else if (j !== -1) {
                    total += j;
                }
            })
        });
        if (total < candidateNumbers) {
            message = `分配人数不能小于当前候选人数量(${candidateNumbers})`;
        }
        if (message) {
            toggleSnackbar(message, 'info');
            return;
        }
        const slots = numbers.reduce((i, j) => [...i, ...j]);
        submit(currentRecruitment.title, slots, step === 1 ? this.groupName : 'interview');
        this.toggleModal();
    };
    sendInterview = () => {
        const { code, step } = this.state;
        const candidates = this.props.candidates
            .map(i => [...i.values()])[step * 2]
            .filter(i => (!i.abandon && i[`time${step}`] && i[`slot${step}`]))
            .map(i => i._id);
        this.props.sendInterview({
            code,
            step,
            candidates
        });
        this.toggleDialog();
    };

    componentDidMount() {
        const { requestCandidate, requestGroup, requestRecruitments, currentRecruitment, toggleSnackbar } = this.props;
        const groupName = this.groupName;
        requestRecruitments();
        if (groupName) {
            requestCandidate(groupName);
            requestGroup(groupName);
            if (currentRecruitment && currentRecruitment.time1) {
                this.initTime(currentRecruitment.time1[groupName]);
            }
        } else {
            toggleSnackbar('请先完善个人信息！', 'warning');
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (!prevProps.currentRecruitment && this.props.currentRecruitment) {
            if (this.state.step === 1 && this.props.currentRecruitment.time1) {
                this.initTime(this.props.currentRecruitment.time1[this.groupName]);
            } else if (this.state.step === 2 && this.props.currentRecruitment.time2) {
                this.initTime(this.props.currentRecruitment.time2);
            }
        }
    }

    render() {
        const { classes, candidates, group, currentRecruitment } = this.props;
        const { step, numbers, modalOpen, code, dialogOpen } = this.state;
        const groupName = this.groupName;
        if (!groupName) {
            return <></>;
        }
        const translator = { 'morning': '上午', 'afternoon': '下午', 'evening': '晚上' };
        const disabled = step === 1
            ? !(candidates.length && candidates[2].size && currentRecruitment && currentRecruitment.time1 && currentRecruitment.time1[groupName] && numbers.length)
            : !(candidates.length && candidates[4].size && currentRecruitment && currentRecruitment.time2 && numbers.length);
        return (
            <div className={classes.infoContainer}>
                <Paper className={classes.paper}>
                    <div className={classes.title}>
                        <Typography variant="title">
                            小组成员信息
                        </Typography>
                    </div>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell classes={{
                                    root: classes.tableCell
                                }}>成员姓名</TableCell>
                                <TableCell classes={{
                                    root: classes.tableCell
                                }}>组长？</TableCell>
                                <TableCell classes={{
                                    root: classes.tableCell
                                }}>管理员？</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Boolean(group.length) && group.map((i, j) => (
                                <TableRow key={j}>
                                    <TableCell component="th" scope="row" classes={{
                                        root: classes.tableCell
                                    }}>{i.username}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>{i.isCaptain ? '是' : '否'}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>{i.isAdmin ? '是' : '否'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <Paper className={classes.paper}>
                    <div className={classes.title}>
                        <div />
                        <Typography variant="title">
                            候选人信息
                        </Typography>
                        <Select
                            value={step}
                            onChange={this.handleChange}
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.length !== 0 && candidates.map(i => [...i.values()])[step * 2].map((i, j) => {
                                const time = i[`time${step}`];
                                const slot = i[`slot${step}`];
                                return (
                                    <TableRow key={j}>
                                        <TableCell component="th" scope="row" classes={{
                                            root: classes.tableCell
                                        }}>{i.name}</TableCell>
                                        <TableCell classes={{
                                            root: classes.tableCell
                                        }}>{i.abandon ? '已放弃' : time && time.length ? '已选择' : '未选择'}</TableCell>
                                        <TableCell classes={{
                                            root: classes.tableCell
                                        }}>{slot && slot.length ? `${slot[0]}-${slot[2]}` : '未分配'}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                    <div className={classes.buttonContainer}>
                        <Button color='primary'
                                variant='contained'
                                onClick={this.toggleModal}
                                className={classes.button}
                                disabled={disabled}
                        >分配时间</Button>
                        <Button color='primary' variant='contained' className={classes.button}
                                disabled={disabled} onClick={this.toggleDialog}>发送短信</Button>
                    </div>
                </Paper>
                <Dialog open={dialogOpen} onClose={this.toggleDialog}>
                    <div className={classes.dialog}>
                        <Verify onChange={this.handleInput} code={code} />
                        <div className={classes.buttonContainer}>
                            <Button color='primary' variant='contained' className={classes.button}
                                    onClick={this.sendInterview}>确认发送</Button>
                            <Button color='primary' className={classes.button} onClick={this.toggleDialog}>取消</Button>
                        </div>
                    </div>
                </Dialog>
                <Modal title='选定人数' open={modalOpen} onClose={this.toggleModal}>
                    <div className={classes.chooseContainer}>
                        {!disabled && (step === 1 ? currentRecruitment.time1[groupName] : currentRecruitment.time2).map((i: Time, j: number) =>
                            <div key={j} className={classes.choose}>
                                <Chip color='primary' label={i.date} className={classes.chip} />
                                {Object.entries(i).filter(i => i[0] !== 'date').map((k, l) =>
                                    <TextField
                                        label={translator[k[0]]}
                                        key={l}
                                        value={Math.max(numbers[j][l], 0)}
                                        innerRef={() => this.handleSelect(j, l)}
                                        onChange={this.handleSelect(j, l)}
                                        className={classes.textField}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        disabled={!k[1]}
                                    />
                                )}
                            </div>
                        )}
                        <Typography variant='caption'
                                    className={classes.notification}>
                            为了使自动分配更加高效，你可以尝试在能够接受的范围内给各时间段分配更多人数
                        </Typography>
                        <div className={classes.buttonContainer}>
                            <Button color='primary' variant='contained' className={classes.button}
                                    onClick={this.submitArrange}>开始分配</Button>
                            <Button color='primary' className={classes.button} onClick={this.toggleModal}>取消分配</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(Group));