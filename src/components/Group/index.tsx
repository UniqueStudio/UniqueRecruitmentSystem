import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { setGroupAdmin } from '@apis/rest';
import { GENDERS } from '@config/consts';
import { User } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/group';
import { titleConverter } from '@utils/titleConverter';

const heads = ['姓名', '性别', '电话号码', '邮箱', '加入时间', '组长？', '管理员？'];

type SelectHandler = (name: string) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
const memberDataConverter = (handleSelect: SelectHandler, admin: Record<string, boolean>, disabled: boolean) => ({
    name,
    gender,
    phone,
    mail,
    joinTime,
    isCaptain,
    isAdmin,
}: User) => [
    name,
    GENDERS[gender],
    phone || '未知',
    mail || '未知',
    titleConverter(joinTime),
    isCaptain ? '是' : '否',
    <Checkbox
        checked={admin[phone] || isAdmin}
        onChange={handleSelect(phone)}
        disabled={disabled || isAdmin}
        color='primary'
    />,
];

export const Group: FC = observer(() => {
    const { $user } = useStores();
    const classes = useStyles();

    if (!$user.groupInfo) {
        return null;
    }

    // { user1: true, user2: false ...}
    const [admin, setAdmin] = useState(
        // use id instead of name to avoid same name in same group
        Object.fromEntries($user.groupInfo.map((member) => [member.id, member.isAdmin])),
    );

    const handleSelect = (phone: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setAdmin({ ...admin, [phone]: event.target.checked });
    };

    const submitChange = () => setGroupAdmin(Object.keys(admin).filter((i) => admin[i]));

    return (
        <div className={classes.tableContainer}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        {heads.map((head, index) => (
                            <TableCell key={index} classes={{ root: classes.tableCell }}>
                                {head}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {$user.groupInfo
                        .map(memberDataConverter(handleSelect, admin, !$user.isAdminOrCaptain))
                        .map((member, index) => (
                            <TableRow key={index}>
                                {member.map((item, idx) => (
                                    <TableCell classes={{ root: classes.tableCell }} key={idx}>
                                        {item}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <Button size='large' onClick={submitChange} color='primary'>
                修改
            </Button>
        </div>
    );
});
