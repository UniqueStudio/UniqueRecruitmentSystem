import React, { PureComponent } from "react";
import Modal from '@material-ui/core/Modal/Modal';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from "../../style/index";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    open: boolean;
    direction?: 'left' | 'right' | 'up' | 'down';
    title: string;
    onClose?: () => void;
}

class InfoModal extends PureComponent<Props> {

    render() {
        const { classes, open, onClose, title, children, direction } = this.props;
        const leaveDirection = direction === 'left' ? 'right' : 'left';
        return (
            <Modal open={open} onClose={onClose} className={classes.modalContainer}>
                <Slide direction={open ? direction || 'right' : leaveDirection} in={open} mountOnEnter unmountOnExit>
                    <div className={classes.modal}>
                        <div className={classes.columnHeader}>
                            <Typography variant="headline" className={classes.columnTitle}>
                                {title}
                            </Typography>
                        </div>
                        {children}
                    </div>
                </Slide>
            </Modal>
        )
    }
}

export default withRoot(withStyles(styles)(InfoModal));

