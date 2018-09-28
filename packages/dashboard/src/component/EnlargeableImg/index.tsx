import React, { PureComponent } from "react";
import Dialog from '@material-ui/core/Dialog';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/massInterview';
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    src: string;
}

class EnlargeableImage extends PureComponent<Props> {
    state = {
        open: false,
    };

    handleImageClick = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            open: false,
        });
    };

    render() {
        const { classes, src } = this.props;
        return (
            <>
                <img src={src} onClick={this.handleImageClick} className={classes.image} />
                <Dialog open={this.state.open} onClose={this.handleClose} maxWidth={false}
                        classes={{ paper: classes.imageLayer, root: classes.imageRoot }}>
                    <img src={src} onClick={this.handleClose} className={classes.image} />
                </Dialog>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(EnlargeableImage));