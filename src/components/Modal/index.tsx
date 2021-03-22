import Modal from '@material-ui/core/Modal';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import React, { FC, memo } from 'react';

import useStyles from '../../styles/modal';

interface Props {
    open: boolean;
    direction?: SlideProps['direction'];
    hideBackdrop?: boolean;
    title: string;
    onClose?: () => void;
}

const InfoModal: FC<Props> = memo(({ open, onClose, title, children, direction, hideBackdrop }) => {
    const classes = useStyles();
    const leaveDirection = direction === 'left' ? 'right' : 'left';
    return (
        <Modal
            open={open}
            onClose={onClose}
            className={classes.modalContainer}
            hideBackdrop={hideBackdrop}
            disableEnforceFocus>
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
        </Modal>
    );
});

export default InfoModal;
