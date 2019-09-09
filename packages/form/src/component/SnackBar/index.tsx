import React, { FC, memo } from 'react';

import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { CheckCircle, Close, Error as ErrorIcon, Info, Warning } from '@material-ui/icons';
import clsx from 'clsx';
import { Variant } from '../../config/types';

const variantIcon = {
    success: CheckCircle,
    warning: Warning,
    error: ErrorIcon,
    info: Info
};

const useStyles1 = makeStyles((theme: Theme) => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
}));

interface Props {
    className?: string;
    message?: string;
    onClose?: () => void;
    variant: Variant;
}

const MySnackbarContentWrapper: FC<Props> = memo(props => {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby='client-snackbar'
            message={
                <span id='client-snackbar' className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key='close' aria-label='Close' color='inherit' onClick={onClose}>
                    <Close className={classes.icon} />
                </IconButton>
            ]}
            {...other}
        />
    );
});

interface SnackbarProps {
    open: boolean;
    content: string;
    onClose: () => void;
    variant: Variant;
}

const CustomSnackbar: FC<SnackbarProps> = memo(({ open, content, onClose, variant }) => {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
        >
            <MySnackbarContentWrapper onClose={onClose} variant={variant} message={content} />
        </Snackbar>
    );
});

export default CustomSnackbar;
