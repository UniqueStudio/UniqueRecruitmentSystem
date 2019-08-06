import { FC, memo, useEffect, useState } from 'react';

import { withSnackbar, WithSnackbarProps } from 'notistack';

import { Props } from '../../containers/Notifier';

const Notifier: FC<Props & WithSnackbarProps> = memo(({ notifications = [], enqueueSnackbar, removeSnackbar }) => {
    const [displayed, setDisplayed] = useState<number[]>([]);

    const storeDisplayed = (id: number) => {
        setDisplayed((prevDisplayed) => [...prevDisplayed, id]);
    };

    useEffect(() => {
        notifications.forEach(({ key, message, options }) => {
            if (displayed.includes(key)) return;
            enqueueSnackbar(message, options);
            storeDisplayed(key);
            removeSnackbar(key);
        });
        // eslint-disable-next-line
    }, [notifications]);

    return null;
}, (({ notifications: prevSnacks }, { notifications: nextSnacks }) => {
    for (const snack of nextSnacks) {
        if (!prevSnacks.find(({ key }) => snack.key === key)) return false;
    }
    return true;
}));

export default withSnackbar(Notifier);
