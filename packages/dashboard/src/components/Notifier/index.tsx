import { autorun } from 'mobx';
import { SnackbarKey, useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { useStores } from '../../hooks/useStores';

const Notifier = () => {
    const [displayed, setDisplayed] = useState<SnackbarKey[]>([]);
    const { $component } = useStores();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    useEffect(() => {
        autorun(() => {
            Object.entries($component.snackbars).forEach(([key, { options, message }]) => {
                if (displayed.includes(key)) return;
                enqueueSnackbar(message, options);
                setDisplayed((prevDisplayed) => [...prevDisplayed, key]);
                $component.removeSnackbar(key);
                closeSnackbar(key);
            });
        });
    }, []);
    return null;
};

export default Notifier;
