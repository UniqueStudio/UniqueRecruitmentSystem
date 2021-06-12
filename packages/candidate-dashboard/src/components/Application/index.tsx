import { Dialog, DialogTitle, Theme, useMediaQuery, styled } from '@material-ui/core';
import { Application } from '@uniqs/config';
import React, { FC } from 'react';

import header from '@assets/header.png';
import { Form } from '@components/Application/Form';

interface Props {
    application?: Partial<Application>;
    open: boolean;
    onClose: () => void;
}

const Header = styled('img')(({ theme: { spacing } }) => ({
    width: '90%',
    maxWidth: spacing(75),
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
            <Form application={application} onCancel={onClose} />
        </Dialog>
    );
};
