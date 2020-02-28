import Button from '@material-ui/core/Button';
import React, {FC, memo, useState} from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { GENDERS } from '../../config/consts';
import { User } from '../../config/types';

import { Props } from '../../containers/Group';

import useStyles from '../../styles/group';

import { titleConverter } from '../../utils/titleConverter';

const heads = ['成员姓名', '性别', '电话号码', '邮箱', '加入时间', '组长？', '管理员？'];

type SelectHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
const memberDataConverter = (handleSelect: SelectHandler, admin: object, disabled: boolean) =>
    ({ username, gender, phone, mail, joinTime, isCaptain }: User) => [
        username,
        GENDERS[gender],
        phone || '未知',
        mail || '未知',
        titleConverter(joinTime),
        isCaptain ? '是' : '否',
        (<Checkbox
            checked={admin[username]}
            onChange={handleSelect(username)}
            disabled={disabled}
            color='primary'
        />)
    ];

const Group: FC<Props> = memo(({ groupInfo, canSetAdmin, submitAdmin, group}) => {
    const classes = useStyles();

    if (!groupInfo) {
        return null;
    }

    // { user1: true, user2: false ...}
    const [admin, setAdmin] = useState(Object.fromEntries(
        groupInfo.map((member) => [member.username, member.isAdmin]),
    ));

    const handleSelect = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdmin({...admin, [name]: event.target.checked});
    };

    const submitChange = () => {
        submitAdmin({group, who: Object.keys(admin).filter((i) => admin[i])});
    };

    return (
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
                                    <TableCell key={index} classes={{root: classes.tableCell}}>{head}</TableCell>,
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {groupInfo
                                .map(memberDataConverter(handleSelect, admin, !canSetAdmin))
                                .map((member, index) => (
                                    <TableRow key={index}>
                                        {member.map((item, idx) =>
                                            <TableCell classes={{root: classes.tableCell}} key={idx}>{item}</TableCell>,
                                        )}
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <Button size='large' onClick={submitChange} color='primary'>修改</Button>
                </div>
            </Paper>
        </div>
    );
});

export default Group;
