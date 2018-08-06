import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
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
import { Candidate, Recruitment, Time, User } from '../../lib/const';

interface Props extends WithStyles {
    candidates: Map<string, Candidate>[];
    group: User[];
    currentRecruitment: Recruitment;
    requestCandidate: (group: string) => void;
    requestGroup: (group: string) => void;
    requestRecruitments: () => void;
    toggleSnackbar: (message: string, color: string) => void;
}

class Group extends PureComponent<Props> {

    state = {
        step: 1,
        groupName: '',
        numbers: [] as number[][],
        open: false
    };
    initTime = (time: Time[]) => {
        this.setState({
            numbers: time.map(i =>
                [i.morning ? 0 : -1, i.afternoon ? 0 : -1, i.evening ? 0 : -1]
            )
        })
    };
    handleChange = (event: React.ChangeEvent) => {
        const step = event.target['value'];
        const { currentRecruitment, requestCandidate } = this.props;
        const { groupName } = this.state;
        this.setState({ step });
        this.initTime(step === 1 ? currentRecruitment.time1[groupName] : currentRecruitment.time2);
        step === 1 ? requestCandidate(groupName) : requestCandidate('interview');
    };
    handleSelect = (i: number, j: number) => (event: React.ChangeEvent) => {
        const numbers = [...this.state.numbers];
        numbers[i] = numbers[i] || [];
        numbers[i][j] = Math.max(event.target['value'], 1);
        this.setState({
            numbers
        })
    };
    toggleModal = () => {
        this.setState({
            open: !this.state.open
        })
    };
    submitArrange = () => {
        const { toggleSnackbar, candidates } = this.props;
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
    };

    constructor(props: Props) {
        super(props);
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            const group = JSON.parse(userInfo)['group'];
            this.state.groupName = group;
            props.requestRecruitments();
            props.requestCandidate(group);
            props.requestGroup(group);
        }
    }

    componentDidMount() {
        if (this.props.currentRecruitment) {
            this.initTime(this.props.currentRecruitment.time1[this.state.groupName]);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (!this.props.currentRecruitment && nextProps.currentRecruitment) {
            this.initTime(nextProps.currentRecruitment.time1[this.state.groupName]);
        }
    }

    render() {
        const { classes, candidates, group, currentRecruitment } = this.props;
        const { step, groupName, numbers, open } = this.state;
        const translator = { 'morning': '上午', 'afternoon': '下午', 'evening': '晚上' };
        const disabled = step === 1
            ? !(candidates.length && currentRecruitment && currentRecruitment.time1 && currentRecruitment.time1[groupName] && numbers.length)
            : !(candidates.length && currentRecruitment && currentRecruitment.time2 && numbers.length);
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
                            {group.length && group.map((i, j) => (
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
                            报名成员信息
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
                                <TableCell>候选人姓名</TableCell>
                                <TableCell>{step === 1 ? '组面时间' : '群面时间'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.length !== 0 && candidates.map(i => [...i.values()])[step === 1 ? 2 : 4].map((i, j) => {
                                const time = step === 1 ? i.time1 : i.time2;
                                return (
                                    <TableRow key={j}>
                                        <TableCell component="th" scope="row">{i.name}</TableCell>
                                        <TableCell>{i.abandon ? '已放弃' : time && time.length ? '已选择' : '未选择'}</TableCell>
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
                                disabled={disabled}>发送短信</Button>
                    </div>
                </Paper>
                <Modal title='选定人数' open={open} onClose={this.toggleModal}>
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