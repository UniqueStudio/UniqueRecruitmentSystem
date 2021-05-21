import React from 'react';
import { render } from 'react-dom';

import { App } from '@views/App';

render(<App />, document.getElementById('root'));

// Now service worker only works under `/`, and cannot handle subroutes like `/dashboard` well.
// One feasible solution is using `HashRouter` rather than `BrowserRouter`
window.addEventListener('load', () => {
    if (import.meta.env.PROD) {
        navigator.serviceWorker?.register('/serviceWorker.js');
    }
});
