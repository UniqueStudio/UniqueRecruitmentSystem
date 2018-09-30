import { createBrowserHistory as createHistory } from 'history';
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { epicMiddleware, epics } from './epic';
import { reducers } from './reducer';

import Main from './view/Main';

export const history = createHistory();

const middleware = [epicMiddleware];

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
