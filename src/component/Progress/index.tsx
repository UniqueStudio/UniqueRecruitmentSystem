import * as React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from "../../style";
import withRoot from "../../style/withRoot";

class Progress extends React.PureComponent<WithStyles> {

    render() {
        const { classes } = this.props;
        return (
            <CircularProgress className={classes.progress} thickness={2} size={100} />
        );
    }
}

export default withRoot(withStyles(styles)(Progress));
