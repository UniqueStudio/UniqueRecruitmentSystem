import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import React from 'react';
import styles from '../../style/Loading';
interface Props extends WithStyles<typeof styles> {
    open: boolean;
}

function Loading(props: Props) {
    return (
        <div className={props.classes.root} style={{ display: props.open ? '' : 'none' }}>
            <CircularProgress classes={{ colorPrimary: props.classes.loading }} />
        </div>
    );
}

export default withStyles(styles)(Loading);
