import React, { memo } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import useStyles from '../../style/Loading';

interface LoadingProps {
    open: boolean;
}

const Loading = memo(({ open }: LoadingProps) => {
    const classes = useStyles({ open });
    return (
        <div className={classes.root}>
            <CircularProgress classes={{ colorPrimary: classes.loading }} />
        </div>
    );
});

export default Loading;
