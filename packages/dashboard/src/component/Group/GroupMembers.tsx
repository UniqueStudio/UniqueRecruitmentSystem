import React, { PureComponent } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/group';
import withRoot from "../../style/withRoot";
import { User } from '../../lib/const';

interface Props extends WithStyles {
    group: User[];
}

class GroupMembers extends PureComponent<Props> {
    render() {
        const { classes, group } = this.props;
        return (
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
        )
    }
}

export default withRoot(withStyles(styles)(GroupMembers));