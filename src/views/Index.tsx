import React, { FC, lazy, memo, Suspense } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';

import Progress from '../components/Progress';

import PageFrame from '../containers/Frame';
import Login from '../containers/Login';
import Notifier from '../containers/Notifier';
import Snackbar from '../containers/Snackbar';

import useStyles from '../styles/global';
import withRoot from '../styles/withRoot';

const Candidates = lazy(() => import('../containers/Candidates'));
const Dashboard = lazy(() => import('../containers/Dashboard'));
const Data = lazy(() => import('../containers/Data'));
const My = lazy(() => import('./My'));
const NoMatch = lazy(() => import('./NoMatch'));

const Index: FC = memo(() => {
    useStyles();
    const routeRender = (Component: JSX.Element) => (props: RouteComponentProps) => (
        <PageFrame {...props}>
            <Suspense fallback={<Progress />}>{Component}</Suspense>
        </PageFrame>
    );
    return (
        <>
            <Snackbar>
                <Notifier />
            </Snackbar>
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='/' exact render={routeRender(<Dashboard />)} />
                <Route path='/data' render={routeRender(<Data />)} />
                <Route path='/candidates' render={routeRender(<Candidates />)} />
                <Route path='/my' render={routeRender(<My />)} />
                <Route render={routeRender(<NoMatch />)} />
            </Switch>
        </>
    );
});

export default withRouter(withRoot(Index));
