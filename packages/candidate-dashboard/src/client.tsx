import createCache from '@emotion/cache';
import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';

const cache = createCache({ key: 'css' });
cache.compat = true;

hydrate(
    <BrowserRouter>
        <App cache={cache} />
    </BrowserRouter>,
    document.querySelector('#root'),
);
