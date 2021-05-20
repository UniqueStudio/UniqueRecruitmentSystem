import { Modal as MuiModal, Slide, SlideProps, Typography } from '@material-ui/core';
import React, { FC, memo } from 'react';

import useStyles from '@styles/modal';

interface Props {
    open: boolean;
    direction?: SlideProps['direction'];
    hideBackdrop?: boolean;
    title: string;
    onClose?: () => void;
}

export const Modal: FC<Props> = memo(({ open, onClose, title, children, direction, hideBackdrop }) => {
    const classes = useStyles();
    const leaveDirection = direction === 'left' ? 'right' : 'left';
    return (
        <MuiModal
            open={open}
            onClose={onClose}
            className={classes.modalContainer}
            hideBackdrop={hideBackdrop}
            disableEnforceFocus
        >
            <Slide direction={open ? direction || 'right' : leaveDirection} in={open} mountOnEnter unmountOnExit>
                <div className={classes.modal}>
                    <div className={classes.modalHeader}>
                        <Typography variant='h5' className={classes.modalTitle}>
                            {title}
                        </Typography>
                    </div>
                    {children}
                </div>
            </Slide>
        </MuiModal>
    );
});
