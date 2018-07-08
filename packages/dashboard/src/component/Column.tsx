import * as React from 'react';
import {
    Divider,
    Paper,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import styles from '../style/style';

interface Props extends WithStyles {
    title?: string
}

class Column extends React.Component<Props> {

    render() {
        const { classes, title, children } = this.props;
        return (
            <Paper className={classes.column}>
                <Typography variant='headline' className={classes.columnTitle}>
                    {title}
                </Typography>
                <Divider/>
                {children}
            </Paper>
        );
    }
}

export default withStyles(styles)(Column);
