import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App />, document.getElementById('root'));
// TODO: bring service worker back

// tslint:disable-next-line:whitespace TODO: remove this after migrating to eslint
import.meta.hot?.accept();
