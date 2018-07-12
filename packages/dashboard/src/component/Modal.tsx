import * as React from "react";
import {
    Modal, Zoom,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";

import styles from "../style/index";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    open: boolean;
    title: string;
    onClose: () => void;
}

class InfoModal extends React.Component<Props> {

    render() {
        const { classes, open, onClose, title, children } = this.props;
        return (
            <Modal
                open={open}
                onClose={onClose}
                className={classes.modalContainer}
            >
                <Zoom in={open}>
                    <div className={classes.modal}>
                        <div className={classes.columnHeader}>
                            <Typography variant="headline" className={classes.columnTitle}>
                                {title}
                            </Typography>
                        </div>
                        {children}
                    </div>
                </Zoom>
            </Modal>
        )
    }
}

export default withRoot(withStyles(styles)(InfoModal));

