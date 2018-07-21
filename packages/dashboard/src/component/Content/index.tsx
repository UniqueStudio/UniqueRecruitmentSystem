import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Snackbar from '../../container/Snackbar/index';
import styles from "../../style";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void
}

class Content extends React.PureComponent<Props> {

    handleClick = () => {
        const { open, toggleOpen } = this.props;
        if (open) toggleOpen();
    };

    render() {
        const { classes, children } = this.props;
        return (
            <main className={classes.content} onClick={this.handleClick}>
                {children}
                <Snackbar place='bl' />
            </main>
        );
    }
}

export default withRoot(withStyles(styles)(Content));
