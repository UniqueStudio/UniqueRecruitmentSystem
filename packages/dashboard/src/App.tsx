import React, { PureComponent } from "react";
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createEpicMiddleware } from "redux-observable";
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory as createHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducers } from "./reducer";
import { epics } from "./epic";

import Main from './view/Main';

export const history = createHistory();

const epicMiddleware = createEpicMiddleware();

const middleware = [thunk, epicMiddleware];

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middleware)));

epicMiddleware.run(epics);

class App extends PureComponent {
    componentDidMount() {
        import('./lib/console').then(({ logger }) => logger());
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <Main />
                </Router>
            </Provider>
        );
    }
}

export default App;
