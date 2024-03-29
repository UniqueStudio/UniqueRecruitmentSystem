import { Alert, AlertColor, AlertTitle, Button, styled, Theme, useMediaQuery } from '@mui/material';
import React, { FC } from 'react';

const ToastContainer = styled(Alert)(({ theme: { breakpoints } }) => ({
    alignItems: 'center',
    '& > .MuiAlert-action': {
        [breakpoints.down('sm')]: {
            flexDirection: 'column',
            justifyContent: 'space-around',
        },
    },
}));

interface Props {
    title: string;
    severity: AlertColor;
    label: string;
    buttons: { label: string; onClick?: () => void }[];
}

export const Toast: FC<Props> = ({ title, severity, label, buttons }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const size = isMobile ? 'small' : 'medium';
    return (
        <ToastContainer
            severity={severity}
            action={
                <>
                    {buttons.map(({ label, onClick }, index) => (
                        <Button key={index} color='inherit' size={size} onClick={onClick}>
                            {label}
                        </Button>
                    ))}
                </>
            }
        >
            <AlertTitle>{title}</AlertTitle>
            {label}
        </ToastContainer>
    );
};
