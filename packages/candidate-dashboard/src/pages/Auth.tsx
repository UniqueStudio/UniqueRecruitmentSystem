import { Avatar, Container, Grid, Paper, Typography } from '@material-ui/core';
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

    return token ? <Redirect to='/dashboard' /> : (
        <Container maxWidth='xs'>
            <Paper elevation={12} sx={{ p: 4 }}>
                <Grid container spacing={4} justifyContent='center'>
                    <Grid item container xs='auto' spacing={2} justifyContent='center'>
                        <Grid item xs='auto'>
                            <Avatar
                                sx={{
                                    height: 64,
                                    width: 64,
                                    bgcolor: blue[50],
                                }}
                            >
                                <DashboardIcon color='primary' fontSize='large' />
                            </Avatar>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant='h5' align='center' component='h1'>
                                联创团队招新系统
                            </Typography>
                            <Typography variant='subtitle1' align='center'>
                                Candidate Dashboard
                            </Typography>
                        </Grid>
                    </Grid>
                    <Switch>
                        <Route path={login}>
                            <Login />
                        </Route>
                        <Route path={register}>
                            <Register />
                        </Route>
                    </Switch>
                </Grid>
            </Paper>
        </Container>
    );
};
