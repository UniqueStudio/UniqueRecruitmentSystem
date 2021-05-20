import { SnackbarProvider } from 'notistack';
import React, { FC } from 'react';

import useStyles from '@styles/snackbar';

export const Snackbar: FC = ({ children }) => {
    const classes = useStyles();
    return (
        <SnackbarProvider
            maxSnack={5}
            classes={{
                variantSuccess: classes.success,
                variantError: classes.error,
                variantWarning: classes.warning,
                variantInfo: classes.info,
            }}
            autoHideDuration={3000}
        >
            <>{children}</>
        </SnackbarProvider>
    );
};
