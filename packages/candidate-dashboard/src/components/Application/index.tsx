import { Dialog, DialogTitle, Theme, useMediaQuery, styled, DialogProps } from '@material-ui/core';
import { Application } from '@uniqs/config';
import React, { FC } from 'react';

import header from '@assets/header.png';
import { Form } from '@components/Application/Form';

interface Props extends DialogProps {
    application?: Partial<Application>;
    onClose: () => void;
}

const Header = styled('img')(({ theme: { spacing } }) => ({
    width: '90%',
    maxWidth: spacing(75),
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
}));

export const ApplicationDialog: FC<Props> = ({ application, ...rest }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    return (
        <Dialog fullScreen={isMobile} fullWidth maxWidth='lg' {...rest}>
            <DialogTitle>报名表单</DialogTitle>
            <Header src={header} />
            {application ? <Form application={application} onClose={rest.onClose} /> : null}
        </Dialog>
    );
};
