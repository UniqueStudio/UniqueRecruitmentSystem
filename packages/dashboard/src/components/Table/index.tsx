import { Button, Chip, Dialog, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { StaticDateTimePicker } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { allocateMany, allocateOne } from '@apis/rest';
import { PERIOD_MAP } from '@config/consts';
import { GroupOrTeam, InterviewType, Step, StepType } from '@config/enums';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/table';
import { compareAllocation } from '@utils/comparators';
import { roundToMinute } from '@utils/time';

export const Table: FC = observer(() => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const candidates =
        $candidate.groupBySteps[$candidate.stepType === StepType.teamInterview ? Step.群面时间选择 : Step.组面时间选择];

    const type = $candidate.stepType === StepType.teamInterview ? InterviewType.team : InterviewType.group;
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: '姓名',
            width: 90,
            disableClickEventBubbling: true,
        },
        {
            field: 'group',
            headerName: '组别',
            width: 90,
            disableClickEventBubbling: true,
        },
        {
            field: 'interviewSelections',
            headerName: '面试选择',
            flex: 1,
            sortable: false,
            disableClickEventBubbling: true,
            cellClassName: classes.cell,
            renderCell(params) {
                const { interviewSelections, group, rejected, abandoned } = params.row as Candidate;
                const selections = interviewSelections.filter(
                    ({ name }) => name === (type === InterviewType.group ? GroupOrTeam[group] : GroupOrTeam.unique),
                );
                return (
                    <>
                        {rejected
                            ? '已淘汰'
                            : abandoned
                            ? '已放弃'
                            : !selections.length
                            ? '未选择'
                            : selections.map(({ date, period }, index) => (
                                <Chip
                                    key={index}
                                    className={classes.chip}
                                    color='primary'
                                    variant='outlined'
                                    size={isMobile ? 'small' : 'medium'}
                                    label={new Date(date).toLocaleDateString('zh-CN') + PERIOD_MAP.get(period)!}
                                />
                            ))}
                    </>
                );
            },
        },
        {
            field: 'interviewAllocations',
            headerName: '面试分配',
            width: 180,
            disableClickEventBubbling: true,
            valueFormatter(params) {
                const { interviewAllocations } = params.row as Candidate;
                return interviewAllocations[type]?.toLocaleString('zh-CN', { timeStyle: 'short', dateStyle: 'short' });
            },
            sortComparator(a, b) {
                return compareAllocation(a?.[type], b?.[type]);
            },
        },
        {
            field: 'NOT_A_FIELD',
            headerName: '手动分配',
            sortable: false,
            disableClickEventBubbling: true,
            renderCell(params) {
                const { id } = params.row as Candidate;
                return (
                    <Button size={isMobile ? 'small' : 'medium'} onClick={() => setCid(id)}>
                        设置
                    </Button>
                );
            },
        },
    ];

    const handleAllocateOne = async () => {
        if (await allocateOne(type, cid, roundToMinute(time))) {
            setCid('');
        }
    };

    const handleAllocateAll = async () => {
        await allocateMany(type, [...$candidate.selected.keys()]);
        $candidate.deselectAll();
    };

    const handleChange = (value: unknown) => {
        value instanceof Date && setTime(value);
    };

    return (
        <>
            <DataGrid
                rows={candidates}
                columns={columns}
                checkboxSelection
                autoHeight
                disableColumnMenu
                density={isMobile ? 'compact' : 'standard'}
                selectionModel={[...$candidate.selected.keys()]}
                onSelectionModelChange={({ selectionModel }) => {
                    $candidate.deselectAll();
                    $candidate.selectMany(selectionModel as string[]);
                }}
                className={classes.table}
                components={{
                    Footer: () => (
                        <Button
                            variant='contained'
                            size={isMobile ? 'small' : 'medium'}
                            disabled={!$candidate.selected.size}
                            onClick={handleAllocateAll}
                            className={classes.tableButton}
                        >
                            为{$candidate.selected.size}名候选人自动分配
                        </Button>
                    ),
                }}
            />
            <Dialog open={!!cid} onClose={() => setCid('')}>
                <StaticDateTimePicker
                    label='选择时间'
                    ampm={false}
                    ampmInClock={false}
                    value={time}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} helperText={undefined} />}
                />
                <Button fullWidth onClick={handleAllocateOne} disabled={!time}>
                    确定
                </Button>
            </Dialog>
        </>
    );
});
