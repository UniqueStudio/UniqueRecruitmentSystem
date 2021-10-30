import { Dialog, DialogContent, DialogProps, DialogTitle, Divider, Theme, useMediaQuery } from '@mui/material';
import React, { FC } from 'react';

import { Allocations } from './Allocations';
import { Selections } from './Selections';

import { useAppSelector } from '@stores/index';

interface Props extends DialogProps {
    onClose: () => void;
}

export const InterviewDialog: FC<Props> = ({ ...rest }) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const application = useAppSelector(({ application }) => application.current);

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
