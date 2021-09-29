import { Chip, Stack, Typography } from '@mui/material';
import React, { FC } from 'react';

import { Application } from '@uniqs/config';

interface Props {
    application: Partial<Application>;
}

export const Allocations: FC<Props> = ({ application: { interviewAllocations } }) => {
    const group = interviewAllocations?.group;
    const team = interviewAllocations?.team;
    return (
        <Stack spacing={1} alignItems='start'>
            <Typography fontWeight='bolder'>组面时间分配结果</Typography>
            {group ? (
                <Chip
                    label={new Date(group).toLocaleString('zh-CN', {
                        dateStyle: 'full',
                        timeStyle: 'full',
                        timeZone: 'Asia/Shanghai',
                        hour12: false,
                    })}
                    color='primary'
                    variant='outlined'
                />
            ) : (
                '无'
            )}
            <Typography fontWeight='bolder'>群面时间分配结果</Typography>
            {team ? (
                <Chip
                    label={new Date(team).toLocaleString('zh-CN', {
                        dateStyle: 'full',
                        timeStyle: 'full',
                        timeZone: 'Asia/Shanghai',
                        hour12: false,
                    })}
                    color='primary'
                    variant='outlined'
                />
            ) : (
                '无'
            )}
        </Stack>
    );
};
