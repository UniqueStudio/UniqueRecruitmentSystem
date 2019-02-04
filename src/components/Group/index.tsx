import React, { PureComponent } from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { InjectedNotistackProps } from 'notistack';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { GENDERS } from '../../config/consts';
import { User } from '../../config/types';
import styles from '../../styles/group';
import { titleConverter } from '../../utils/titleConverter';

interface Props extends WithStyles {
    groupInfo: User[];
    enqueueSnackbar: InjectedNotistackProps['enqueueSnackbar'];
}

const heads = ['成员姓名', '性别', '电话号码', '邮箱', '加入时间', '组长？', '管理员？'];
const memberDataConverter = ({ username, gender, phone, mail, joinTime, isCaptain, isAdmin }: User) => [
    username,
    GENDERS[gender],
    phone || '未知',
    mail || '未知',
    titleConverter(joinTime),
    isCaptain ? '是' : '否',
    isAdmin ? '是' : '否'
];

class Group extends PureComponent<Props> {

    render() {
        const { classes, groupInfo } = this.props;
        if (!groupInfo) {
            return null;
        }
        return (
            <>
                <div className={classes.infoContainer}>
                    <Paper className={classes.paper}>
                        <div className={classes.title}>
                            <Typography variant='h6'>
                                本组成员信息
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
                                    {groupInfo.map(memberDataConverter).map((member, index) =>
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
                </div>
            </>
        );
    }
}

export default withStyles(styles)(Group);
