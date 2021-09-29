import { AlertColor, styled } from '@mui/material';
import React, { FC } from 'react';

import { SnackbarItem } from './Item';

interface Notification {
    message: string;
    variant: AlertColor;
}

interface Props {
    notifications: Record<string, Notification>;
    onClose: (key: string) => void;
    maxItems?: number;
    autoHideDuration?: number;
}

const Container = styled('div')(({ theme: { zIndex, breakpoints, spacing } }) => ({
    zIndex: zIndex.snackbar,
    position: 'fixed',
    display: 'grid',
    gap: spacing(1),
    left: spacing(1),
    right: spacing(1),
    bottom: spacing(1),
    [breakpoints.up('sm')]: {
        left: spacing(3),
        right: 'auto',
        bottom: spacing(3),
    },
}));

export const Notifier: FC<Props> = ({ maxItems = 5, autoHideDuration = 3000, notifications, onClose }) => {
    return (
        <Container>
            {Object.entries(notifications).map(([key, { variant, message }], index, array) => (
                <SnackbarItem
                    key={key}
                    popped={index < array.length - maxItems}
                    autoHideDuration={autoHideDuration}
                    variant={variant}
                    message={message}
                    TransitionProps={{
                        onExited() {
                            onClose(key);
                        },
                    }}
                />
            ))}
        </Container>
    );
};
