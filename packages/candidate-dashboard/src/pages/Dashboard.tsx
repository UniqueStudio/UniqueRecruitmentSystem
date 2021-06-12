import { Alert, AlertTitle, Button, Container, Paper, Stack } from '@material-ui/core';
import { Application, STEP_MAP } from '@uniqs/config';
import { convertRecruitmentName } from '@uniqs/utils';
import React, { FC, useState } from 'react';

import { getMyInfo, getPendingRecruitments } from '@apis/rest';
import { ApplicationDialog } from '@components/Application';
import { Guard } from '@components/Guard';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { TabsLayout } from '@layouts/TabsLayout';
import { useAppSelector } from '@stores/index';

const Applications: FC = () => {
    const info = useAppSelector(({ candidate }) => candidate.info);
    const recruitments = useAppSelector(({ recruitment }) => recruitment.recruitments);
    const applications = info?.applications ?? [];
    const appliedRecruitments = new Set(applications.map(({ recruitment: { id } }) => id));
    const [application, setApplication] = useState<Partial<Application>>();
    const handleCloseApplication = () => {
        setApplication(undefined);
    };
    return (
        <>
            <Stack sx={{ width: '100%' }} spacing={1}>
                {recruitments
                    .filter(({ id }) => !appliedRecruitments.has(id))
                    .map((recruitment) => (
                        <Alert
                            severity='info'
                            key={recruitment.id}
                            action={
                                <Button
                                    color='inherit'
                                    sx={{ alignSelf: 'center' }}
                                    onClick={() => setApplication({ recruitment })}
                                >
                                    立即报名
                                </Button>
                            }
                        >
                            <AlertTitle>New!</AlertTitle>
                            {convertRecruitmentName(recruitment.name)}
                        </Alert>
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
                        <Alert
                            severity={ended || rejected || abandoned ? 'error' : stopped ? 'warning' : 'success'}
                            key={id}
                            action={
                                <>
                                    <Button
                                        color='inherit'
                                        sx={{ alignSelf: 'center' }}
                                    >
                                        查看面试
                                    </Button>
                                    <Button
                                        color='inherit'
                                        sx={{ alignSelf: 'center' }}
                                        onClick={() => setApplication(application)}
                                    >
                                        查看申请
                                    </Button>
                                </>
                            }
                        >
                            <AlertTitle>
                                {ended
                                    ? 'Ended.'
                                    : rejected
                                    ? 'Rejected :('
                                    : abandoned
                                    ? 'Abandoned ;('
                                    : stopped
                                    ? 'Processing...'
                                    : 'Applying...'}
                            </AlertTitle>
                            {`${convertRecruitmentName(name)} - ${STEP_MAP.get(step)!}`}
                        </Alert>
                    );
                })}
            </Stack>
            <ApplicationDialog open={!!application} application={application} onClose={handleCloseApplication} />
        </>
    );
};

const Dashboard: FC = () => {
    useAsyncEffect(async () => {
        await getMyInfo();
        await getPendingRecruitments();
    }, []);

    return (
        <Container maxWidth='xl'>
            <Paper sx={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <TabsLayout
                    items={[
                        { component: <Applications />, value: 'applications', label: '我的申请' },
                        { component: <div>TODO</div>, value: 'info', label: '我的信息' },
                    ]}
                />
            </Paper>
        </Container>
    );
};

export default () => (
    <Guard>
        <Dashboard />
    </Guard>
);
