import { Container, Paper } from '@material-ui/core';
import React, { FC } from 'react';

import { getMyInfo, getPendingRecruitments } from '@apis/rest';
import { Guard } from '@components/Guard';
import { Info } from '@components/Info';
import { Overview } from '@components/Overview';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { TabsLayout } from '@layouts/TabsLayout';

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
                        { component: <Overview />, value: 'overview', label: '我的申请' },
                        { component: <Info />, value: 'info', label: '我的信息' },
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
