import { LinearProgress } from '@mui/material';
import React, { FC, memo } from 'react';

import useStyles from '@styles/progress';

export const Progress: FC = memo(() => {
    const classes = useStyles();
    return <LinearProgress className={classes.progress} color='secondary' />;
});
