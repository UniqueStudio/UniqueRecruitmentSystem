import { Dialog, DialogContent, DialogProps, DialogTitle, Divider, Theme, useMediaQuery } from '@material-ui/core';
import { Application } from '@uniqs/config';
import React, { FC } from 'react';

import { Allocations } from './Allocations';
import { Selections } from './Selections';

interface Props extends DialogProps {
    application?: Application;
    onClose: () => void;
}

export const InterviewDialog: FC<Props> = ({ application, ...rest }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    if (!application) {
        return null;
    }
    return (
        <Dialog fullScreen={isMobile} fullWidth maxWidth='lg' {...rest}>
            <DialogTitle>面试信息</DialogTitle>
            <DialogContent>
                <Selections application={application} />
                <Divider sx={{ marginY: 1 }} />
                <Allocations application={application} />
            </DialogContent>
        </Dialog>
    );
};
