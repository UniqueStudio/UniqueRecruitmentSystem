import { Component } from 'react';

import { InjectedNotistackProps } from 'notistack';

import { EnqueueSnackbar } from '../../actions';

interface Props extends InjectedNotistackProps {
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
        const { notifications = [] } = this.props;

        notifications.forEach((notification) => {
            if (this.displayed.includes(notification.key)) return;
            this.props.enqueueSnackbar(notification.message, notification.options);
            this.storeDisplayed(notification.key);
            this.props.removeSnackbar(notification.key);
        });
    }

    render() {
        return null;
    }
}

export default Notifier;
