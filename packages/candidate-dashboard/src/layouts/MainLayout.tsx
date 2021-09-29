import { Box } from '@mui/material';
import React, { FC, useState } from 'react';

import background from '@assets/background.png';
import { useAsyncEffect } from '@hooks/useAsyncEffect';
import { setToken } from '@stores/candidate';
import { removeSnackbar } from '@stores/component';
import { useAppDispatch, useAppSelector } from '@stores/index';
import { Notifier } from '@uniqs/ui';
import { validateJWT } from '@uniqs/utils';

export const MainLayout: FC = ({ children }) => {
    const [initialized, setInitialized] = useState(false);
    const snackbars = useAppSelector((state) => state.component.snackbars);
    const dispatch = useAppDispatch();

    useAsyncEffect(async () => {
        // TODO: authentication with SSR?
        const { primitiveStorage } = await import('@utils/storage');
        const token = primitiveStorage.get('token');
        if (validateJWT(token)) {
            dispatch(setToken(token));
        }
        setInitialized(true);
    }, []);

    return (
        <Box
            sx={{
                background: `url("${background}")`,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {initialized && children}
            <Notifier notifications={snackbars} onClose={(key) => dispatch(removeSnackbar(key))} />
        </Box>
    );
};
