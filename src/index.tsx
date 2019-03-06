import React from 'react';
import { render } from 'react-dom';
import App from './App';
import register from './registerServiceWorker';

render(
    <App />,
    document.getElementById('root'),
);
register();
