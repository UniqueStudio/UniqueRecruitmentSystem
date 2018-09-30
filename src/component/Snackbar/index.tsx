import React, { PureComponent } from 'react';

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import CloseIcon from '@material-ui/icons/Close';

import styles from '../../style/snackbar';
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    on: boolean;
    info: string;
    color: string;
    place: string;
    toggleOff: () => void;
}

class Snack extends PureComponent<Props> {

    handleClose = () => {
        this.props.toggleOff();
    };

    render() {
        const { on, info, classes, color, place } = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: place.indexOf('t') === -1 ? 'bottom' : 'top',
                    horizontal:
                        place.indexOf('l') !== -1
                            ? 'left'
                            : place.indexOf('c') !== -1 ? 'center' : 'right',
                }}
                open={on}
                autoHideDuration={4000}
                onClose={this.handleClose}
                message={<span>{info}</span>}
                action={[
                    <IconButton
                        key='close'
                        onClick={this.handleClose}
                    >
                        <CloseIcon className={classes.iconButton} />
                    </IconButton>,
                ]}
                ContentProps={{
                    classes: {
                        root: classes[color],
                    },
                }}
            />
        );
    }
}

export default withRoot(withStyles(styles)(Snack));
