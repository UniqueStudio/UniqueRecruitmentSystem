import { Button, Paper, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
import React, { FC, useState } from 'react';

import { setRecruitmentSchedule } from '@apis/rest';
import { BarChart } from '@components/Chart/BarChart';
import { Schedule } from '@components/Schedule';
import { GROUP_MAP, STEP_MAP } from '@config/consts';
import { Group } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/data';
import { getMidnight } from '@utils/getMidnight';

export const RecruitmentDetail: FC = observer(() => {
    const { $recruitment, $component, $user } = useStores();
    const { beginning, end, deadline, id, statistics } = $recruitment.recruitments.get($recruitment.viewing)!;
    const classes = useStyles();
    const [beginningState, setBeginning] = useState(new Date(beginning));
    const [endState, setEnd] = useState(new Date(end));
    const [deadlineState, setDeadline] = useState(new Date(deadline));
    const [tab, setTab] = useState<Group>($user.info.group);
    const handleChange = (name: string) => (date: Date | null) => {
        if (!date) {
            return;
        }
        if (name === 'begin') setBeginning(date);
        if (name === 'end') setEnd(date);
        if (name === 'stop') setDeadline(date);
    };

    const setTime = () => {
        if (beginningState >= endState) {
            $component.enqueueSnackbar('结束时间必须大于开始时间', 'warning');
            return;
        }
        if (deadlineState >= endState) {
            $component.enqueueSnackbar('截止时间必须大于开始时间', 'warning');
            return;
        }
        return setRecruitmentSchedule(id, {
            beginning: getMidnight(beginningState),
            deadline: getMidnight(deadlineState),
            end: getMidnight(endState),
        });
    };
    const result = {} as Record<Group, number[]>;
    GROUP_MAP.forEach((_, group) => {
        result[group] = [];
        STEP_MAP.forEach((_, key) => {
            const current = statistics?.[group]?.[key] || 0;
            result[group].push(current);
        });
    });

    return (
        <Paper className={classes.recruitmentContainer}>
            <TabContext value={tab}>
                <TabList
                    onChange={(event, newValue) => setTab(newValue)}
                    indicatorColor='primary'
                    textColor='primary'
                    variant='scrollable'
                    scrollButtons='auto'>
                    {[...GROUP_MAP.entries()].map(([key, name]) => (
                        <Tab label={name} key={key} value={key} />
                    ))}
                </TabList>
                {[...GROUP_MAP.keys()].map((key) => (
                    <TabPanel value={key} key={key}>
                        <BarChart data={result[key]} labels={[...STEP_MAP.values()]} title='各轮选手分布' />
                    </TabPanel>
                ))}
            </TabContext>
            <div>
                <Schedule
                    beginning={beginningState}
                    end={endState}
                    deadline={deadlineState}
                    onChange={handleChange}
                    disabled={!$user.isAdminOrCaptain}
                    disablePast={false}
                />
                <div className={classes.buttonContainer}>
                    <Button onClick={setTime} variant='contained' color='primary' disabled={!$user.isAdminOrCaptain}>
                        修改时间
                    </Button>
                </div>
            </div>
        </Paper>
    );
});
