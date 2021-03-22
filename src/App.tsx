import { createBrowserHistory } from 'history';
import React, { FC, memo } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { logger } from './utils/console';
import Index from './views/Index';

createBrowserHistory();
logger();

const App: FC = memo(() => {
    return (
        <BrowserRouter>
            <Index />
        </BrowserRouter>
    );
});

export default App;
