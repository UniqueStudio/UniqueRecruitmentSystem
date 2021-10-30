import { Stack } from '@mui/material';
import React, { FC, useState } from 'react';

import { ApplicationDialog } from '@components/Application';
import { InterviewDialog } from '@components/Interview';
import { Toast } from '@components/Toast';
import { setApplication } from '@stores/application';
import { useAppDispatch, useAppSelector } from '@stores/index';
import { STEP_MAP } from '@uniqs/config';
import { convertRecruitmentName } from '@uniqs/utils';

export const Overview: FC = () => {
    const info = useAppSelector(({ candidate }) => candidate.info);
    const recruitments = useAppSelector(({ recruitment }) => recruitment.recruitments);
    const applications = info?.applications ?? [];
    const appliedRecruitments = new Set(applications.map(({ recruitment: { id } }) => id));
    const [open, setOpen] = useState<'interview' | 'application'>();
    const dispatch = useAppDispatch();

    return (
        <Stack spacing={1}>
            {recruitments
                .filter(({ id }) => !appliedRecruitments.has(id))
                .map((recruitment) => (
                    <Toast
                        severity='info'
                        key={recruitment.id}
                        buttons={[
                            {
                                label: '立即报名',
                                onClick() {
                                    setOpen('application');
                                    dispatch(setApplication({ recruitment }));
                                },
                            },
                        ]}
                        title='New!'
                        label={convertRecruitmentName(recruitment.name)}
                    />
                ))}
            {applications.map((application) => {
                const {
                    recruitment: { name, deadline, end },
                    id,
                    rejected,
                    abandoned,
                    step,
                } = application;
                const stopped = new Date(deadline) < new Date();
                const ended = new Date(end) < new Date();
                return (
                    <Toast
                        severity={ended || rejected || abandoned ? 'error' : stopped ? 'warning' : 'success'}
                        key={id}
                        buttons={[
                            {
                                label: '查看面试',
                                onClick() {
                                    setOpen('interview');
                                    dispatch(setApplication(application));
                                },
                            },
                            {
                                label: '查看申请',
                                onClick() {
                                    setOpen('application');
                                    dispatch(setApplication(application));
                                },
                            },
                        ]}
                        title={
                            ended
                                ? 'Ended.'
                                : rejected
                                ? 'Rejected :('
                                : abandoned
                                ? 'Abandoned ;('
                                : stopped
                                ? 'Processing...'
                                : 'Applying...'
                        }
                        label={`${convertRecruitmentName(name)} - ${STEP_MAP.get(step)!}`}
                    />
                );
            })}
            <ApplicationDialog open={open === 'application'} onClose={() => setOpen(undefined)} />
            <InterviewDialog open={open === 'interview'} onClose={() => setOpen(undefined)} maxWidth='sm' />
        </Stack>
    );
};
