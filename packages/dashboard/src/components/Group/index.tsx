import { Button, Checkbox, useMediaQuery, useTheme } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { setGroupAdmin } from '@apis/rest';
import { GENDERS } from '@config/consts';
import { Member } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/group';
import { compareRecruitment, convertRecruitmentName } from '@uniqs/utils';

export const Group: FC = observer(() => {
    const { $member } = useStores();
    const classes = useStyles();
    const [newAdmins, setNewAdmins] = useState(new Set<string>());
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: '姓名',
            flex: 1.5,
        },
        {
            field: 'gender',
            headerName: '性别',
            valueFormatter: ({ value }) => GENDERS[value as number],
        },
        {
            field: 'phone',
            headerName: '电话号码',
            flex: 2,
        },
        {
            field: 'mail',
            headerName: '邮箱',
            flex: 2.5,
        },
        {
            field: 'joinTime',
            headerName: '加入时间',
            flex: 2,
            sortable: true,
            valueFormatter: ({ value }) => convertRecruitmentName(value as string).slice(0, 5),
            sortComparator: (a, b) => compareRecruitment(a as string, b as string),
        },
        {
            field: 'isCaptain',
            headerName: '组长',
            type: 'boolean',
        },
        {
            field: 'isAdmin',
            headerName: '管理员',
            flex: 1.5,
            renderCell({ row }) {
                const { id, isAdmin } = row as Member;
                return (
                    <Checkbox
                        checked={newAdmins.has(id) || isAdmin}
                        onChange={({ target: { checked } }) => {
                            setNewAdmins((prevAdmins) => {
                                const admins = new Set(prevAdmins);
                                void (checked ? admins.add(id) : admins.delete(id));
                                return admins;
                            });
                        }}
                        disabled={!$member.isAdminOrCaptain || isAdmin}
                        size={isMobile ? 'small' : 'medium'}
                    />
                );
            },
        },
    ];

    const submitChange = () => setGroupAdmin([...newAdmins]);

    return (
        <div className={classes.tableContainer}>
            <DataGrid
                className={classes.table}
                columns={columns.map((column) => ({
                    headerAlign: 'center',
                    align: 'center',
                    flex: 1,
                    sortable: false,
                    ...column,
                }))}
                rows={toJS($member.groupInfo)}
                density={isMobile ? 'compact' : 'standard'}
                autoHeight
                disableColumnMenu
                disableSelectionOnClick
                components={{
                    Footer: () => (
                        <Button className={classes.button} onClick={submitChange}>
                            修改
                        </Button>
                    ),
                }}
            />
        </div>
    );
});
