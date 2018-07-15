import data from './data';
import components from './components';

export interface StoreState {
    components: {
        drawerOpen: boolean;
        snackbar: {
            on: boolean;
            info: string;
            color: string;
        };
    };
    data: {
        candidates: object;
        selected: string[];
        isLoading: boolean;
        group: string;
        loggedIn: boolean;
    };
    routerReducer: object;
}

export const reducer = {
    components,
    data
};