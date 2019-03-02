import React, { PureComponent } from 'react';

import Modal from '@material-ui/core/Modal/Modal';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../styles/modal';

interface Props extends WithStyles<typeof styles> {
    open: boolean;
    direction?: 'left' | 'right' | 'up' | 'down';
    hideBackdrop?: boolean;
    title: string;
    onClose?: () => void;
}

class InfoModal extends PureComponent<Props> {

    render() {
        const { classes, open, onClose, title, children, direction, hideBackdrop } = this.props;
        const leaveDirection = direction === 'left' ? 'right' : 'left';
        return (
            <Modal open={open} onClose={onClose} className={classes.modalContainer} hideBackdrop={hideBackdrop}>
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
    }
}

export default withStyles(styles)(InfoModal);
