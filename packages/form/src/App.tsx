import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducers } from "./reducer";
import { composeWithDevTools } from 'redux-devtools-extension';

import './style/index.css';
import Container from './view/Apply';

const store = createStore(reducers, composeWithDevTools());

class App extends React.Component {
    public render() {
        return (
            <Provider store={store}>
                <div className='main'>
                    <Container />
                </div>
            </Provider>
        );
    }
}

export default App;
