import { Snackbar, Alert, AlertColor, Slide, SlideProps, SnackbarProps } from '@mui/material';
import React, { FC, useEffect, useState } from 'react';

const Transition: FC<SlideProps> = (props) => <Slide {...props} direction='right' />;

interface Props extends SnackbarProps {
    variant: AlertColor;
    popped: boolean;
}

export const SnackbarItem: FC<Props> = ({ message, variant, popped, ...otherProps }) => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        if (popped) {
            setOpen(false);
        }
    }, [popped]);
    return (
        <Snackbar
            open={open}
            onClose={(_, reason) => {
                if (reason === 'clickaway') {
                    return;
                }
                setOpen(false);
            }}
            sx={{ position: 'static', display: 'block' }}
            TransitionComponent={Transition}
            {...otherProps}
        >
            <Alert sx={{ minWidth: 300 }} elevation={4} variant='filled' severity={variant}>
                {message}
            </Alert>
        </Snackbar>
    );
};
