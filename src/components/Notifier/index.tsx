import { autorun } from 'mobx';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { useStores } from '../../hooks/useStores';

const Notifier = () => {
    const [displayed, setDisplayed] = useState<SnackbarKey[]>([]);
    const { componentStateStore } = useStores();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        autorun(() => {
            Object.entries(componentStateStore.snackbars).forEach(([key, { options, message }]) => {
                if (displayed.includes(key)) return;
                enqueueSnackbar(message, options);
                setDisplayed((prevDisplayed) => [...prevDisplayed, key]);
                componentStateStore.removeSnackbar(key);
                closeSnackbar(key);
            });
        });
    }, []);
    return null;
};

export default Notifier;
