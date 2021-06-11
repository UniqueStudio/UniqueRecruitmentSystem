import { Box, Container, Paper, styled, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { convertRecruitmentName } from '@uniqs/utils';
import React, { FC, useEffect } from 'react';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { getMyInfo } from '@apis/rest';
import header from '@assets/header.png';
import { Apply } from '@components/Apply';
import { Guard } from '@components/Guard';
import { useAppSelector } from '@stores/index';

const Panel = styled(TabPanel)(({ theme: { breakpoints, spacing } }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: spacing(150),
    mx: 'auto',
    [breakpoints.down('xs')]: {
        padding: spacing(1),
    },
}));

const Dashboard: FC = () => {
    const info = useAppSelector(({ candidate }) => candidate.info);
    const { url } = useRouteMatch();
    const applications = (info?.applications ?? []).map((application) => ({
        ...application,
        path: `${url}/${application.recruitment.name}`,
    }));
    const routeMatch = useRouteMatch(applications.map(({ path }) => path).concat(`${url}/new`));
    const history = useHistory();

    useEffect(() => {
        void getMyInfo();
    }, []);

    useEffect(() => {
        if (!routeMatch) {
            history.push(applications.length ? applications[applications.length - 1].path : `${url}/new`);
        }
    }, [routeMatch, url]);

    return (
        <Container maxWidth='xl'>
            <Paper sx={{ minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <TabContext value={routeMatch?.url ?? `${url}/new`}>
                    <TabList centered scrollButtons allowScrollButtonsMobile>
                        <Tab label='创建申请' value={`${url}/new`} component={Link} to={`${url}/new`} />
                        {applications.map(({ path, recruitment: { name } }) => (
                            <Tab
                                label={convertRecruitmentName(name)}
                                value={path}
                                key={path}
                                component={Link}
                                to={path}
                            />
                        ))}
                    </TabList>
                    <Switch>
                        <Route path={`${url}/new`}>
                            <Panel value={`${url}/new`}>
                                <Box
                                    sx={{ background: `center / contain no-repeat url("${header}")` }}
                                    flex={1}
                                    mb={2}
                                    minHeight={150}
                                />
                                <Apply />
                            </Panel>
                        </Route>
                        {applications.map((
                            { rank, intro, grade, group, major, institute, isQuick, referrer, recruitment, path },
                        ) => (
                            <Route key={path} path={path}>
                                <TabPanel value={path} sx={{ flex: 1 }}>
                                    <Apply
                                        defaultValues={{
                                            rank,
                                            intro,
                                            grade,
                                            group,
                                            major,
                                            institute,
                                            isQuick,
                                            referrer,
                                            rid: recruitment.id,
                                        }}
                                    />
                                </TabPanel>
                            </Route>
                        ))}
                    </Switch>
                </TabContext>
            </Paper>
        </Container>
    );
};

export default () => <Guard><Dashboard /></Guard>;
