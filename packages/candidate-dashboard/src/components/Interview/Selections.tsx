import { Stack, Typography } from '@material-ui/core';
import { Application, GroupOrTeam, InterviewType, PERIOD_MAP, Step } from '@uniqs/config';
import React, { FC, useState } from 'react';

import { getSlots, selectInterview } from '@apis/rest';
import { TransferList } from '@components/TransferList';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { useAppSelector } from '@stores/index';

interface Props {
    application: Application;
}

export const Selections: FC<Props> = ({ application }) => {
    const [ok, setOk] = useState(false);
    const { id, step, group, interviewSelections } = application;
    const type = step === Step.组面时间选择 ? InterviewType.group : step === Step.群面时间选择 ? InterviewType.team : undefined;
    const name = step === Step.组面时间选择 ? GroupOrTeam[group] : step === Step.群面时间选择 ? GroupOrTeam.unique : undefined;
    const slots = useAppSelector(({ recruitment }) => recruitment.interviews);
    const selected = interviewSelections.filter((interview) => interview.name === name);

    useAsyncEffect(async () => {
        if (type) {
            await getSlots(id, type);
            setOk(true);
        }
    }, [id, type]);

    return (
        <Stack spacing={1} alignItems='start'>
            <Typography fontWeight='bolder'>
                面试时间段选择
                {type === InterviewType.group && '（组面）'}
                {type === InterviewType.team && '（群面）'}
            </Typography>
            {ok && !!type && (
                <TransferList
                    l={selected.length ? [] : slots.map(({ id, date, period }) => [
                        id,
                        new Date(date).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                        }) + PERIOD_MAP.get(period)!,
                    ])}
                    r={selected.map(({ id, date, period }) => [
                        id,
                        new Date(date).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                        }) + PERIOD_MAP.get(period)!,
                    ])}
                    disabled={!!selected.length}
                    onSubmit={(_, r) => selectInterview(id, type, r)}
                />
            )}
            {!type && <Typography>当前无需选择</Typography>}
        </Stack>
    );
};
