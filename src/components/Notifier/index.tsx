import { Component } from 'react';

import { WithSnackbarProps } from 'notistack';

import { EnqueueSnackbar } from '../../actions';

interface Props extends WithSnackbarProps {
    notifications: EnqueueSnackbar['notification'][];
    removeSnackbar: (key: number) => void;
}

class Notifier extends Component<Props> {
    displayed = [] as number[];

    storeDisplayed = (id: number) => {
        this.displayed = [...this.displayed, id];
    };

    shouldComponentUpdate({ notifications: newSnacks = [] as EnqueueSnackbar['notification'][] }) {
        const { notifications: currentSnacks } = this.props;
        let notExists = false;
        newSnacks.forEach((snack) => {
            if (notExists) return;
            notExists = notExists || !currentSnacks.filter(({ key }) => snack.key === key).length;
        });
        return notExists;
    }

    componentDidUpdate() {
        const { notifications = [], enqueueSnackbar, removeSnackbar } = this.props;

        notifications.forEach(({ key, message, options }) => {
            if (this.displayed.includes(key)) return;
            enqueueSnackbar(message, options);
            this.storeDisplayed(key);
            removeSnackbar(key);
        });
    }

    render() {
        return null;
    }
}

export default Notifier;
