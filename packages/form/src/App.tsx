import { CssBaseline } from '@material-ui/core';
import React, { PureComponent } from 'react';

import './style/index.scss';
import Container from './view';

class App extends PureComponent {
    componentDidMount() {
        import('./utils/logger').then(({ logger }) => logger());
    }

    render() {
        return (
            <div className='main'>
                <CssBaseline />
                <Container />
            </div>
        );
    }
}

export default App;
