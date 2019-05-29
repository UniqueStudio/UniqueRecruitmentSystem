import React, { PureComponent } from 'react';

import Dialog from '@material-ui/core/Dialog';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import styles from '../../styles/messenger';

interface Props extends WithStyles<typeof styles> {
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
                <img src={src} onClick={this.handleImageClick} className={classes.image} alt='small' />
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    maxWidth={false}
                    classes={{ paper: classes.imageLayer, root: classes.imageRoot }}
                >
                    <img src={src} onClick={this.handleClose} className={classes.image} alt='original' />
                </Dialog>
            </>
        );
    }
}

export default withStyles(styles)(EnlargeableImage);
