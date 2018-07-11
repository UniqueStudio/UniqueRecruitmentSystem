import * as React from "react";
import {
    IconButton,
    Snackbar,
    WithStyles,
    withStyles
} from "@material-ui/core";
import {
    Close as CloseIcon
} from '@material-ui/icons';

import styles from "../style/style";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    on: boolean;
    info: string;
    color: string;
    place: string;
    toggleOff: () => void;
}

class Snack extends React.Component<Props> {

    handleClose = () => {
        this.props.toggleOff();
    };

    render() {
        const { on, info, classes, color, place } = this.props;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: place.indexOf("t") === -1 ? "bottom" : "top",
                    horizontal:
                        place.indexOf("l") !== -1
                            ? "left"
                            : place.indexOf("c") !== -1 ? "center" : "right"
                }}
                open={on}
                autoHideDuration={2000}
                onClose={this.handleClose}
                message={<span>{info}</span>}
                action={[
                    <IconButton
                        key='close'
                        onClick={this.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
                ContentProps={{
                    classes: {
                        root: classes[color],
                    }
                }}
            />
        );
    }
}

export default withRoot(withStyles(styles)(Snack));
