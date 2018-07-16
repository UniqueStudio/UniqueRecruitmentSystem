import * as React from "react";
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Route } from 'react-router';
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer } from "./reducer";

import Main from './view/Main';
import View from './view/View';
import Data from './view/Data';
import Index from './view/Index';

export const history = createHistory();

const middleware = [thunk, routerMiddleware(history)];

const store = createStore(combineReducers({
    data: reducer.data,
    components: reducer.components,
    routerReducer,
}), composeWithDevTools(applyMiddleware(...middleware)));

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Main>
                        <Route path='/' exact component={Index} />
                        <Route path='/view' component={View} />
                        <Route path='/data' component={Data} />
                    </Main>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
