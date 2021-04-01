import { Button, Chip, Dialog, Paper, Typography } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { DateTimePicker } from '@material-ui/pickers';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';

import { allocateMany, allocateOne } from '@apis/rest';
import { PERIOD_MAP } from '@config/consts';
import { GroupOrTeam, InterviewType, Step, StepType } from '@config/enums';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/table';
import { sortByAllocation } from '@utils/sortByAllocation';

export const Table: FC = observer(() => {
    const { $candidate } = useStores();
    const classes = useStyles();
    const [dialog, setDialog] = useState(false);
    const [cid, setCid] = useState('');
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        $candidate.deselectAll();
    }, [$candidate.stepType]);

    const candidates =
        $candidate.groupBySteps[$candidate.stepType === StepType.teamInterview ? Step.群面时间选择 : Step.组面时间选择];

    const type = $candidate.stepType === StepType.teamInterview ? InterviewType.team : InterviewType.group;
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: '姓名',
            flex: 1,
            disableClickEventBubbling: true,
        },
        {
            field: 'group',
            headerName: '组别',
            flex: 1,
            disableClickEventBubbling: true,
        },
        {
            field: 'interviewSelections',
            headerName: '面试选择',
            flex: 3,
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
            flex: 2,
            disableClickEventBubbling: true,
            valueFormatter(params) {
                const { interviewAllocations } = params.row as Candidate;
                return interviewAllocations[type]?.toLocaleString('zh-CN');
            },
            sortComparator(a, b) {
                return sortByAllocation(a?.[type], b?.[type]);
            },
        },
        {
            field: '',
            headerName: '手动分配',
            flex: 1,
            sortable: false,
            disableClickEventBubbling: true,
            renderCell(params) {
                const { id } = params.row as Candidate;
                return (
                    <Button variant='contained' color='primary' onClick={toggleDialog(id)}>
                        设置
                    </Button>
                );
            },
        },
    ];

    const handleAllocateOne = () => {
        const date = new Date(time);
        date.setSeconds(0, 0);
        return allocateOne(type, cid, date);
    };

    const handleAllocateAll = async () => {
        await allocateMany(type, [...$candidate.selected.keys()]);
        $candidate.deselectAll();
    };

    const toggleDialog = (id = '') => () => {
        setDialog(!!id);
        setCid(id);
    };

    const handleChange = (value: Date | null) => {
        value && setTime(value);
    };

    return (
        <Paper className={classes.paper}>
            <Typography variant='h6' align='center'>
                {type === InterviewType.team ? '群面时间选择' : '组面时间选择'}阶段候选人信息
            </Typography>
            <DataGrid
                rows={candidates}
                columns={columns}
                checkboxSelection
                autoHeight
                disableColumnMenu
                selectionModel={[...$candidate.selected.keys()]}
                onSelectionModelChange={({ selectionModel }) => {
                    $candidate.deselectAll();
                    $candidate.selectMany(selectionModel as string[]);
                }}
                components={{
                    Footer: () => (
                        <Button
                            color='primary'
                            variant='contained'
                            disabled={!$candidate.selected.size}
                            onClick={handleAllocateAll}
                            className={classes.tableButton}>
                            为{$candidate.selected.size}名候选人自动分配
                        </Button>
                    ),
                }}
            />
            <Dialog open={dialog} onClose={toggleDialog()}>
                <div className={classes.dialog}>
                    <DateTimePicker
                        label='选择时间'
                        className={classes.dateSelection}
                        ampm={false}
                        value={time}
                        onChange={handleChange}
                        format='yyyy/MM/dd HH:mm'
                    />
                    <Button color='primary' variant='contained' onClick={handleAllocateOne} disabled={!time}>
                        确定
                    </Button>
                </div>
            </Dialog>
        </Paper>
    );
});
