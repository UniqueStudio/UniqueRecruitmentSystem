import { combineReducers } from 'redux';
import infoHandler from './infoHandler';
import componentsToggler from './componentsToggler';

export interface StoreState {
    componentsState: {
        drawerOpen: boolean;
        snackbar: {
            on: boolean;
            info: string;
        };
    };
    candidates: object;
}

export const reducer = combineReducers({
    componentsState: componentsToggler,
    candidates: infoHandler
});