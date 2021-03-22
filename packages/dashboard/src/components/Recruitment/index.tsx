import React, { FC, useState } from 'react';

import { observer } from 'mobx-react-lite';

import Button from '@material-ui/core/Button';

import Allocation from '../Allocation';
import Schedule from '../Schedule';

import { GROUPS, GROUPS_ } from '../../config/consts';
import { Group, Time } from '../../config/types';

import useStyles from '../../styles/data';

import { setRecruitment } from '../../apis/rest';
import { useStores } from '../../hooks/useStores';
import { getMidnight } from '../../utils/getMidnight';

const Recruitment: FC = observer(() => {
    const { recruitmentStore, componentStateStore, userStore } = useStores();
    const { begin, end, stop, title, groups, interview } = recruitmentStore.recruitments.find(
        (recruitment) => recruitment.title === recruitmentStore.viewing,
    )!;
    const classes = useStyles();
    const [beginS, setBeginS] = useState(new Date(begin));
    const [endS, setEndS] = useState(new Date(end));
    const [stopS, setStopS] = useState(new Date(stop));
    const handleChange = (name: string) => (date: Date | null) => {
        if (!date) {
            return;
        }
        if (name === 'begin') setBeginS(date);
        if (name === 'end') setEndS(date);
        if (name === 'stop') setStopS(date);
    };

    const setInterview = (type: 'team' | 'group', groupName?: Group) => (interviewTime: Time[]) => {
        if (beginS >= endS) {
            componentStateStore.enqueueSnackbar('结束时间必须大于开始时间！', 'warning');
            return;
        }
        if (stopS >= endS) {
            componentStateStore.enqueueSnackbar('截止时间必须大于开始时间！', 'warning');
            return;
        }
        return setRecruitment({
            title,
            group: groupName,
            begin: getMidnight(beginS),
            end: getMidnight(endS),
            stop: getMidnight(stopS),
            [`${type}Interview`]: interviewTime,
        });
    };

    const setTime = () => {
        if (beginS >= endS) {
            componentStateStore.enqueueSnackbar('结束时间必须大于开始时间！', 'warning');
            return;
        }
        if (stopS >= endS) {
            componentStateStore.enqueueSnackbar('截止时间必须大于开始时间！', 'warning');
            return;
        }
        return setRecruitment({
            title,
            begin: getMidnight(beginS),
            stop: getMidnight(stopS),
            end: getMidnight(endS),
        });
    };

    return (
        <div className={classes.recruitmentContainer}>
            <div className={classes.textFieldContainer}>
                <Schedule
                    begin={beginS}
                    end={endS}
                    stop={stopS}
                    onChange={handleChange}
                    disabled={!userStore.isAdminOrCaptain}
                    disablePast={false}
                    className={classes.datePicker}
                />
                <div className={classes.buttonContainer}>
                    <Button
                        onClick={setTime}
                        variant='contained'
                        color='primary'
                        disabled={!userStore.isAdminOrCaptain}>
                        修改时间
                    </Button>
                </div>
            </div>
            {groups.map(({ name, interview: groupInterview }, index) => (
                <Allocation
                    title={`${GROUPS[GROUPS_.indexOf(name)]}组组面时间/人数`}
                    key={index}
                    dates={groupInterview}
                    disabled={!userStore.isAdminOrCaptain && userStore.info.group !== name}
                    setRecruitment={setInterview('group', name)}
                />
            ))}
            <Allocation
                title='群面时间/人数'
                dates={interview}
                disabled={!userStore.isAdminOrCaptain}
                setRecruitment={setInterview('team')}
            />
        </div>
    );
});

export default Recruitment;
