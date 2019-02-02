import React, { lazy, PureComponent, Suspense } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';

const Candidates = lazy(() => import('../containers/Candidates'));
const Dashboard = lazy(() => import('../containers/Dashboard'));
const Data = lazy(() => import('../containers/Data'));
const My = lazy(() => import('../containers/My'));
const NoMatch = lazy(() => import('./NoMatch'));

import PageFrame from '../containers/Frame';
import Login from './Login';

import Progress from '../components/Progress';
import Snackbar from '../components/Snackbar';
import Notifier from '../containers/Notifier';

import withRoot from '../styles/withRoot';

class Index extends PureComponent {

    routeRender = (Component: JSX.Element) => (props: RouteComponentProps) =>
        <PageFrame {...props}>
            <Suspense fallback={<Progress/>}>
                {Component}
            </Suspense>
        </PageFrame>;

    render() {
        return (
            <Snackbar>
                <Notifier/>
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/' exact render={this.routeRender(<Dashboard/>)}/>
                    <Route path='/data' render={this.routeRender(<Data/>)}/>
                    <Route path='/candidates' render={this.routeRender(<Candidates/>)}/>
                    <Route path='/my' render={this.routeRender(<My/>)}/>
                    <Route render={this.routeRender(<NoMatch/>)}/>
                </Switch>
            </Snackbar>
        );
    }
}

export default withRouter(withRoot(Index));
