import { Button } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';

import { setRecruitmentSchedule } from '@apis/rest';
import { BarChart } from '@components/Chart/BarChart';
import { Schedule } from '@components/Schedule';
import { GROUP_MAP, STEP_MAP } from '@config/consts';
import { Group } from '@config/enums';
import { useStores } from '@hooks/useStores';
import { TabLayout } from '@layouts/TabLayout';
import useStyles from '@styles/recruitmentDetail';
import { roundToDay } from '@utils/time';

export const RecruitmentDetail: FC = observer(() => {
    const { $recruitment, $component, $user } = useStores();
    const classes = useStyles();
    const [beginningState, setBeginning] = useState(new Date());
    const [endState, setEnd] = useState(new Date());
    const [deadlineState, setDeadline] = useState(new Date());
    const init = () => {
        const recruitment = $recruitment.viewingRecruitment;
        if (!recruitment) {
            return;
        }
        const { beginning, end, deadline } = recruitment;
        setBeginning(beginning);
        setEnd(end);
        setDeadline(deadline);
    };
    useEffect(init, [$recruitment.viewingId]);

    const recruitment = $recruitment.viewingRecruitment;
    if (!recruitment) {
        return null;
    }
    const { id, statistics } = recruitment;

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
            beginning: roundToDay(beginningState),
            deadline: roundToDay(deadlineState),
            end: roundToDay(endState),
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
        <div className={classes.container}>
            <div className={classes.timelineContainer}>
                <Schedule
                    beginning={beginningState}
                    end={endState}
                    deadline={deadlineState}
                    onChange={handleChange}
                    disabled={!$user.isAdminOrCaptain}
                    disablePast={false}
                />
                <Button onClick={setTime} variant='contained' color='primary' disabled={!$user.isAdminOrCaptain}>
                    修改时间
                </Button>
            </div>
            <TabLayout
                variant='scrollable'
                items={[...GROUP_MAP.entries()].map(([value, label]) => ({
                    value,
                    label,
                    component: <BarChart data={result[value]} labels={[...STEP_MAP.values()]} title='各轮选手分布' />,
                }))}
            />
        </div>
    );
});
