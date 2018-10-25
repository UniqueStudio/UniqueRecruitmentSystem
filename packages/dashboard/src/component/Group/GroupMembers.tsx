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

import { User } from '../../lib/const';

import titleConverter from '../../lib/titleConverter';

interface Props extends WithStyles {
    group: User[];
}

const heads = ['成员姓名', '性别', '电话号码', '邮箱', '加入时间', '组长？', '管理员？'];
const memberDataConverter = ({ username, sex, phone, mail, joinTime, isCaptain, isAdmin }: User) => [
    username,
    !sex ? '未知' : sex === 'Male' ? '男' : '女',
    phone,
    mail || '未知',
   joinTime ? titleConverter(joinTime) : '未知',
    isCaptain ? '是' : '否',
    isAdmin ? '是' : '否'
];

class GroupMembers extends PureComponent<Props> {
    render() {
        const { classes, group } = this.props;
        return (
            <Paper className={classes.paper}>
                <div className={classes.title}>
                    <Typography variant='title'>
                        小组成员信息
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
                            {Boolean(group.length) && group.map(memberDataConverter).map((member, index) =>
                                <TableRow key={index}>
                                    {member.map((item, idx) =>
                                        <TableCell classes={{ root: classes.tableCell }} key={idx}>{item}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(GroupMembers);
