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
    toggleOn: () => void;
}

class Snack extends React.Component<Props> {

    handleClose = () => {
        this.props.toggleOn();
    };

    render() {
        const { on, info } = this.props;
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                open={on}
                autoHideDuration={3000}
                onClose={this.handleClose}
                message={<span>{info}</span>}
                action={[
                    <IconButton
                        key='close'
                        onClick={this.handleClose}
                        color={'primary'}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />
        );
    }
}

export default withRoot(withStyles(styles)(Snack));
