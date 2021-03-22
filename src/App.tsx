import { createBrowserHistory } from 'history';
import React, { FC, memo, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Index from './views/Index';

createBrowserHistory();

const App: FC = memo(() => {
    useEffect(() => {
        import('./utils/console').then(({ logger }) => logger());
    }, []);

    return (
        <BrowserRouter>
            <Index />
        </BrowserRouter>
    );
});

export default App;
