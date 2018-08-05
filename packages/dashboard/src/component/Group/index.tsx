import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/group';
import withRoot from "../../style/withRoot";
import { Candidate } from '../../lib/const';

interface Props extends WithStyles {
    requestCandidate: (group: string) => void;
    candidates: Map<string, Candidate>[]
}

class Group extends PureComponent<Props> {

    state = {
        candidates: this.props.candidates
    };

    constructor(props: Props) {
        super(props);
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            props.requestCandidate(JSON.parse(userInfo)['group']);
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            candidates: nextProps.candidates
        })
    }

    render() {
        const { classes } = this.props;
        const { candidates } = this.state;
        return candidates.length !== 0 && (
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
                                <TableCell>成员姓名</TableCell>
                                <TableCell>组长？</TableCell>
                                <TableCell>管理员？</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    123
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    123
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    123
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
                <Paper className={classes.paper}>
                    <Typography variant="title">
                        报名成员信息
                    </Typography>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>候选人姓名</TableCell>
                                <TableCell>组面时间</TableCell>
                                <TableCell>群面时间</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {candidates.map(i => [...i.values()]).reduce((i, j) => [...i, ...j]).map((i: any, j: any) => (
                                <TableRow key={j}>
                                    <TableCell component="th" scope="row">
                                        {i.name}
                                    </TableCell>
                                    <TableCell>{i.time1 && i.time1.length ? '已选择' : '未选择'}</TableCell>
                                    <TableCell>{i.time2 && i.time2.length ? '已选择' : '未选择'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className={classes.buttonContainer}>
                        <Button color='primary' variant='contained'>分配时间</Button>
                        <Button color='primary' variant='contained'>发送短信</Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default withRoot(withStyles(styles)(Group));