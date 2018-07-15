import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { WithStyles, withStyles } from '@material-ui/core/styles';


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
