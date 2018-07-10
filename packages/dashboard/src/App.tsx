import * as React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import { reducer } from "./reducer";
import Main from "./view/Main";
import View from "./view/View";

const store = createStore(reducer, composeWithDevTools());

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Main>
                    <View />
                </Main>
            </Provider>
        );
    }
}

export default App;
