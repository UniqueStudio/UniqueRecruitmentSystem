import { SnackbarProvider } from 'notistack';
import React, { FC } from 'react';

export const Snackbar: FC = ({ children }) => {
    return (
        <SnackbarProvider
            maxSnack={5}
            autoHideDuration={3000}
        >
            <>{children}</>
        </SnackbarProvider>
    );
};
