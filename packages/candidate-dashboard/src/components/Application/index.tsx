import { Dialog, DialogTitle, Theme, useMediaQuery, styled, DialogProps } from '@mui/material';
import React, { FC } from 'react';

import header from '@assets/header.png';
import { Form } from '@components/Application/Form';
import { useAppSelector } from '@stores/index';

interface Props extends DialogProps {
    onClose: () => void;
}

const Header = styled('img')(({ theme: { spacing } }) => ({
    width: '90%',
    maxWidth: spacing(75),
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
}));

export const ApplicationDialog: FC<Props> = (props) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const application = useAppSelector(({ application }) => application.current);

    return (
        <Dialog fullScreen={isMobile} fullWidth maxWidth='lg' {...props}>
            <DialogTitle>报名表单</DialogTitle>
            <Header src={header} />
            {application ? <Form application={application} onClose={props.onClose} /> : null}
        </Dialog>
    );
};
