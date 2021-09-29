import { CssBaseline, StyledEngineProvider, ThemeProvider, useMediaQuery } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import { observer } from 'mobx-react-lite';
import React, { FC, ReactElement, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Login } from '@components/Login';
import { Progress } from '@components/Progress';
import { Snackbars } from '@components/Snackbars';
import { useStores } from '@hooks/useStores';
import { MainLayout } from '@layouts/MainLayout';
import useStyles from '@styles/global';
import { useTheme } from '@uniqs/ui';
import { logger } from '@utils/console';

const Applications = lazy(() => import('./Applications'));
const Dashboard = lazy(() => import('./Dashboard'));
const Interviews = lazy(() => import('./Interviews'));
const My = lazy(() => import('./My'));
const Welcome = lazy(() => import('./Welcome'));

logger();

const Theme: FC = observer(({ children }) => {
    const systemTheme = useMediaQuery('(prefers-color-scheme: dark)');
    const { $component } = useStores();
    const theme = useTheme($component.darkMode ?? systemTheme);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
});

export const App: FC = () => {
    useStyles();
    const routeRender = (Component: ReactElement) => () =>
        (
            <MainLayout>
                <Suspense fallback={<Progress />}>{Component}</Suspense>
            </MainLayout>
        );
    return (
        <StyledEngineProvider injectFirst>
            <Theme>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <BrowserRouter>
                        <Snackbars />
                        <Switch>
                            <Route path='/login' component={Login} />
                            <Route path='/' exact render={routeRender(<Welcome />)} />
                            <Route path='/dashboard' render={routeRender(<Dashboard />)} />
                            <Route path='/interviews' render={routeRender(<Interviews />)} />
                            <Route path='/applications' render={routeRender(<Applications />)} />
                            <Route path='/my' render={routeRender(<My />)} />
                            <Route render={routeRender(<Welcome easterEgg={true} />)} />
                        </Switch>
                    </BrowserRouter>
                </LocalizationProvider>
            </Theme>
        </StyledEngineProvider>
    );
};
