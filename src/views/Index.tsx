import React, { ComponentType, LazyExoticComponent, PureComponent, Suspense } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router';

const Candidates = React.lazy(() => import('Containers/Candidates'));
const Dashboard = React.lazy(() => import('Containers/Dashboard'));
const Data = React.lazy(() => import('Containers/Data'));
const My = React.lazy(() => import('Containers/My'));
const NoMatch = React.lazy(() => import('./NoMatch'));

import PageFrame from 'Containers/Frame';
import Login from './Login';

import Progress from 'Components/Progress';
import Snackbar from 'Components/Snackbar';
import Notifier from 'Containers/Notifier';

import withRoot from 'Styles/withRoot';

class Index extends PureComponent {

    routeRender = (Component: LazyExoticComponent<ComponentType>) => (props: RouteComponentProps) =>
        <PageFrame {...props}>
            <Suspense fallback={<Progress />}>
                <Component />
            </Suspense>
        </PageFrame>;

    render() {
        return (
            <Snackbar>
                <Notifier />
                <Switch>
                    <Route path='/login' component={Login} />
                    <Route path='/' exact render={this.routeRender(Dashboard)} />
                    <Route path='/data' render={this.routeRender(Data)} />
                    <Route path='/candidates' render={this.routeRender(Candidates)} />
                    <Route path='/my' render={this.routeRender(My)} />
                    <Route render={this.routeRender(NoMatch)} />
                </Switch>
            </Snackbar>
        );
    }
}

export default withRouter(withRoot(Index));
