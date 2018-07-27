import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Snackbar from '../../container/Snackbar/index';
import styles from "../../style";
import withRoot from "../../style/withRoot";
import Progress from '../Progress';

interface Props extends WithStyles {
    open: boolean;
    loading: boolean;
    toggleOpen: () => void
}

class Content extends React.PureComponent<Props> {

    handleClick = () => {
        const { open, toggleOpen } = this.props;
        if (open) toggleOpen();
    };

    render() {
        const { classes, children, loading } = this.props;
        return (
            <main className={classes.content} onClick={this.handleClick} id="main">
                {children}
                <Snackbar place='bl' />
                {loading && <Progress />}
            </main>
        );
    }
}

export default withRoot(withStyles(styles)(Content));
