import * as React from "react";
import LinearProgress from '@material-ui/core/LinearProgress';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from "../../style";
import withRoot from "../../style/withRoot";

class Progress extends React.PureComponent<WithStyles> {

    render() {
        const { classes } = this.props;
        return (
            <LinearProgress className={classes.progress} color='primary' />
        );
    }
}

export default withRoot(withStyles(styles)(Progress));
