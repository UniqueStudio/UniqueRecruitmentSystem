import React, { PureComponent } from 'react';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select'
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
    candidates: Candidate[];
    interviewStage: number;
    disabled: boolean;
    handleChange: (event: React.ChangeEvent) => void;
    toggleDialog: () => void;
    toggleModal: () => void;
}

class Candidates extends PureComponent<Props> {

    render() {
        const { classes, candidates, disabled, interviewStage, handleChange, toggleDialog, toggleModal } = this.props;
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Boolean(candidates.length) && candidates.map((i, j) => {
                            const time = i[`time${interviewStage}`];
                            const slot = i[`slot${interviewStage}`];
                            return (
                                <TableRow key={j}>
                                    <TableCell component="th" scope="row" classes={{
                                        root: classes.tableCell
                                    }}>{i.name}</TableCell>
                                    <TableCell classes={{
                                        root: classes.tableCell
                                    }}>{i.rejected ? '已淘汰' : i.abandon ? '已放弃' : time && time.length ? '已选择' : '未选择'}</TableCell>
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
                            onClick={toggleModal}
                            className={classes.button}
                            disabled={disabled}
                    >分配时间</Button>
                    <Button color='primary' variant='contained' className={classes.button}
                            disabled={disabled} onClick={toggleDialog}>发送短信</Button>
                </div>
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(Candidates));