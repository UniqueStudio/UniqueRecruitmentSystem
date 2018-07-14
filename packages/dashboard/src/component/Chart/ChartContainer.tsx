import * as React from 'react';
import {
    Paper,
    WithStyles,
    withStyles
} from '@material-ui/core';

import withRoot from '../../style/withRoot';
import styles from '../../style/chart';

class ChartContainer extends React.Component<WithStyles> {
    render() {
        const { classes, children } = this.props;
        return (
            <Paper className={classes.chart}>
                {children}
            </Paper>
        )
    }
}

export default withRoot(withStyles(styles)(ChartContainer));
