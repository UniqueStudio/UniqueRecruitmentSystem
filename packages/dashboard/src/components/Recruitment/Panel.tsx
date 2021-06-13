import { Box, Button, Paper, Typography } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { compareRecruitment, convertRecruitmentName, roundToDay } from '@uniqs/utils';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC, MouseEventHandler, useMemo, useState } from 'react';

import { getApplications, setRecruitmentSchedule } from '@apis/rest';
import { AddOne } from '@components/AddOne';
import { DoughnutChart } from '@components/Chart/DoughnutChart';
import { Modal } from '@components/Modal';
import { Schedule } from '@components/Schedule';
import { GROUP_MAP, STEP_SHORT_MAP } from '@config/consts';
import { Group, Status } from '@config/enums';
import { Recruitment } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/recruitmentPanel';

interface Props {
    recruitment: Recruitment;
    onToggle: (id: string) => MouseEventHandler<HTMLButtonElement>;
}

const RecruitmentOverview: FC<Props> = observer(({ recruitment: { statistics, end, id, name }, onToggle }) => {
    const classes = useStyles();
    const [group, setGroup] = useState<Group>();
    const { $recruitment, $member, $component } = useStores();
    const result = {} as Record<Group, number[]>;
    let total = 0;
    GROUP_MAP.forEach((_, group) => {
        result[group] = [];
        let sum = 0;
        STEP_SHORT_MAP.forEach((_, key) => {
            const current = statistics?.[group]?.[key] || 0;
            sum += current;
            result[group].push(current);
        });
        total += sum;
        result[group].push(sum);
    });
    const handleSet = () => {
        if (compareRecruitment($member.info.joinTime, name) >= 0) {
            $component.enqueueSnackbar('你不能查看本次招新', Status.info);
            return;
        }
        $component.enqueueSnackbar('设置成功，正在获取候选人信息', Status.success);
        return getApplications(id);
    };
    const data = group ? result[group].slice(0, -1) : Object.values(result).map((t) => t[STEP_SHORT_MAP.size]);
    const title = group ? `${GROUP_MAP.get(group)!}组各轮情况` : convertRecruitmentName(name);
    const labels = group ? [...STEP_SHORT_MAP.values()] : [...GROUP_MAP.values()];
    const selected = $recruitment.viewingId === id;
    const EyeIcon = selected ? VisibilityIcon : VisibilityOffIcon;
    const expired = Date.now() > +end;
    return (
        <Paper
            key={id}
            className={clsx(classes.container, {
                [classes.selected]: selected,
                [classes.expired]: expired,
            })}
        >
            {useMemo(
                () => (
                    <Box className={classes.chartContainer}>
                        <div className={classes.chart}>
                            <DoughnutChart
                                data={data}
                                title={title}
                                labels={labels}
                                onClick={(_, elements) => {
                                    if (!elements.length) {
                                        return;
                                    }
                                    setGroup((group) => group ? undefined : [...GROUP_MAP.keys()][elements[0].index]);
                                }}
                            />
                        </div>
                        <Typography variant='body1' className={classes.centerText}>
                            总计：{group ? result[group][STEP_SHORT_MAP.size] : total}人
                        </Typography>
                    </Box>
                ),
                [statistics, group],
            )}
            <div className={classes.buttonsContainer}>
                <Button color='inherit' onClick={handleSet} fullWidth disabled={selected}>
                    <EyeIcon />
                    {selected ? '当前招新' : '查看招新'}
                </Button>
                <Button
                    color='inherit'
                    onClick={onToggle(id)}
                    fullWidth
                    disabled={!$member.isAdminOrCaptain || expired}
                >
                    <EditIcon />
                    修改时间
                </Button>
            </div>
        </Paper>
    );
});

export const RecruitmentPanel: FC = observer(() => {
    const classes = useStyles();
    const { $recruitment, $component, $member } = useStores();
    const [id, setId] = useState('');
    const [beginningState, setBeginning] = useState(new Date());
    const [endState, setEnd] = useState(new Date());
    const [deadlineState, setDeadline] = useState(new Date());

    const handleToggle = (id: string) => () => {
        setId(id);
        const recruitment = $recruitment.recruitments.get(id);
        if (!recruitment) {
            return;
        }
        const { beginning, end, deadline } = recruitment;
        setBeginning(new Date(beginning));
        setEnd(new Date(end));
        setDeadline(new Date(deadline));
    };

    const handleChange = (name: 'beginning' | 'deadline' | 'end') => (date: unknown) => {
        if (!(date instanceof Date)) {
            return;
        }
        if (name === 'beginning') setBeginning(date);
        if (name === 'end') setEnd(date);
        if (name === 'deadline') setDeadline(date);
    };

    const setTime = () => {
        if (beginningState >= endState) {
            $component.enqueueSnackbar('结束时间必须大于开始时间', Status.warning);
            return;
        }
        if (deadlineState >= endState) {
            $component.enqueueSnackbar('截止时间必须大于开始时间', Status.warning);
            return;
        }
        return setRecruitmentSchedule(id, {
            beginning: roundToDay(beginningState).toJSON(),
            deadline: roundToDay(deadlineState).toJSON(),
            end: roundToDay(endState).toJSON(),
        });
    };
    return (
        <>
            <Modal
                title='全部招新'
                open={$component.recruitmentPanelOpen}
                onClose={() => $component.toggleRecruitmentPanel()}
            >
                <div className={classes.blocksContainer}>
                    <AddOne />
                    {$recruitment.recruitmentsArray.map((recruitment) => (
                        <RecruitmentOverview recruitment={recruitment} onToggle={handleToggle} key={recruitment.id} />
                    ))}
                </div>
            </Modal>
            <Modal title='修改招新' open={!!id} onClose={handleToggle('')}>
                <div className={classes.timelineContainer}>
                    <Schedule
                        beginning={beginningState}
                        end={endState}
                        deadline={deadlineState}
                        onChange={handleChange}
                        disabled={!$member.isAdminOrCaptain}
                    />
                    <Button onClick={setTime} variant='contained' disabled={!$member.isAdminOrCaptain}>
                        修改时间
                    </Button>
                </div>
            </Modal>
        </>
    );
});
