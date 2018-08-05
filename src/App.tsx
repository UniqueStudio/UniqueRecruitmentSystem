import React, { PureComponent } from "react";
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createBrowserHistory as createHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducers } from "./reducer";

import Main from './view/Main';
import CommonInterview from './view/CommonInterview';
import Data from './view/Data';
import FinalInterview from './view/FinalInterview';
import Index from './view/Index';
import MyInfo from './view/MyInfo';
import MyGroup from './view/MyGroup';

export const history = createHistory();

const middleware = [thunk, routerMiddleware(history)];

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middleware)));

class App extends PureComponent {
    componentDidMount() {
        import('./lib/console').then(({ logger }) => logger());
    }

    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Main>
                        <Route path='/' exact component={Index} />
                        <Route path='/data' component={Data} />
                        <Route path='/commonInterview' component={CommonInterview} />
                        <Route path='/finalInterview' component={FinalInterview} />
                        <Route path='/myInfo' component={MyInfo} />
                        <Route path='/myGroup' component={MyGroup} />
                    </Main>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
