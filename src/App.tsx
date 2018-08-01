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
import View from './view/View';
import Data from './view/Data';
import Index from './view/Index';
import My from './view/My';

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
                        <Route path='/view' component={View} />
                        <Route path='/data' component={Data} />
                        <Route path='/my' component={My} />
                    </Main>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
