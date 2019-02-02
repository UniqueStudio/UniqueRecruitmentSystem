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
                <Container />
            </div>
        );
    }
}

export default App;
