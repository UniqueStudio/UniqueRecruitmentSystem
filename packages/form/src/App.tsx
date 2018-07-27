import * as React from 'react';

import './style/index.css';
import Container from './view/Apply';


class App extends React.Component {
    public render() {
        return (
                <div className='main'>
                    <Container />
                </div>
        );
    }
}

export default App;
