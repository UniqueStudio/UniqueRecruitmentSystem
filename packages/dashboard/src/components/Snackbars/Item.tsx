import { Snackbar, Alert, Slide, SlideProps, SnackbarProps } from '@material-ui/core';
import { Color } from '@material-ui/lab';
import React, { FC, useEffect, useState } from 'react';

const Transition: FC<SlideProps> = (props) => <Slide {...props} direction='right' />;

interface Props extends SnackbarProps {
    variant: Color;
    popped: boolean;
}

export const SnackbarItem: FC<Props> = ({ message, variant, popped, ...otherProps }) => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        popped && setOpen(false);
    }, [popped]);
    return (
        <Snackbar
            open={open}
            onClose={(_, reason) => {
                reason === 'timeout' && setOpen(false);
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
