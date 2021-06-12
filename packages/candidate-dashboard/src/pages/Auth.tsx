import { Avatar, Container, Paper, Stack, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { DashboardRounded as DashboardIcon } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { Login } from '@components/Login';
import { Register } from '@components/Register';
import { useAppSelector } from '@stores/index';

export default () => {
    const token = useAppSelector(({ candidate }) => candidate.token);
    const { url } = useRouteMatch();
    const login = `${url}/login`;
    const register = `${url}/register`;
    const routeMatch = useRouteMatch([login, register]);
    const history = useHistory();

    useEffect(() => {
        if (!routeMatch) {
            history.push(login);
        }
    }, [routeMatch, login]);

    return token ? (
        <Redirect to='/dashboard' />
    ) : (
        <Container maxWidth='xs'>
            <Paper elevation={12} sx={{ p: 4 }}>
                <Stack spacing={2} alignItems='center'>
                    <Avatar
                        sx={{
                            height: 64,
                            width: 64,
                            bgcolor: blue[50],
                        }}
                    >
                        <DashboardIcon color='primary' fontSize='large' />
                    </Avatar>
                    <Stack spacing={1} alignItems='center'>
                        <Typography variant='h5'>联创团队招新系统</Typography>
                        <Typography variant='subtitle1'>Candidate Dashboard</Typography>
                    </Stack>
                    <Switch>
                        <Route path={login}>
                            <Login />
                        </Route>
                        <Route path={register}>
                            <Register />
                        </Route>
                    </Switch>
                </Stack>
            </Paper>
        </Container>
    );
};
