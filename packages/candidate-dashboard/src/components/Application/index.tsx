import {
    Dialog,
    DialogTitle,
    Theme,
    useMediaQuery,
} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import { Application } from '@uniqs/config';
import React, { FC } from 'react';

import header from '@assets/header.png';
import { Form } from '@components/Application/Form';

interface Props {
    application?: Partial<Application>;
    open: boolean;
    onClose: () => void;
}

const Header = styled('img')(() => ({
    width: '90%',
    maxWidth: 600,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
}));

export const ApplicationDialog: FC<Props> = ({ application, open, onClose }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <Dialog open={open} onClose={onClose} fullScreen={isMobile} fullWidth maxWidth='lg'>
            <DialogTitle>报名表单</DialogTitle>
            <Header src={header} />
            <Form application={application} />
        </Dialog>
    );
};
