import DateFnsUtils from '@date-io/date-fns';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { observer } from 'mobx-react-lite';
import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { Frame } from '@components/Frame';
import { Login } from '@components/Login';
import { Notifier } from '@components/Notifier';
import { Progress } from '@components/Progress';
import { Snackbar } from '@components/Snackbar';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/global';
import { useTheme } from '@styles/theme';
import { logger } from '@utils/console';

const Candidates = lazy(() => import('./Candidates'));
const Dashboard = lazy(() => import('./Dashboard'));
const Data = lazy(() => import('./Data'));
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

const App: FC = () => {
    useStyles();
    const routeRender = (Component: JSX.Element) => (props: RouteComponentProps) => (
        <Frame {...props}>
            <Suspense fallback={<Progress />}>{Component}</Suspense>
        </Frame>
    );
    return (
        <Theme>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <BrowserRouter>
                    <Snackbar>
                        <Notifier />
                    </Snackbar>
                    <Switch>
                        <Route path='/login' component={Login} />
                        <Route path='/' exact render={routeRender(<Welcome />)} />
                        <Route path='/dashboard' exact render={routeRender(<Dashboard />)} />
                        <Route path='/data' render={routeRender(<Data />)} />
                        <Route path='/candidates' render={routeRender(<Candidates />)} />
                        <Route path='/my' render={routeRender(<My />)} />
                        <Route render={routeRender(<Welcome easterEgg={true} />)} />
                    </Switch>
                </BrowserRouter>
            </MuiPickersUtilsProvider>
        </Theme>
    );
};

export default App;
