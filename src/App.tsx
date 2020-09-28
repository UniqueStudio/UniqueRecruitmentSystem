import { createBrowserHistory as createHistory } from 'history';
import React, { FC, memo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { epicMiddleware, epics } from './epics';
import { reducers } from './reducers';
import Index from './views/Index';

createHistory();

const middleware = [epicMiddleware];

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middleware)));

epicMiddleware.run(epics);

const App: FC = memo(() => {
    useEffect(() => {
        import('./utils/console').then(({ logger }) => logger());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Index />
            </Router>
        </Provider>
    );
});

export default App;
