import React from 'react';

import { LinearProgress } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import styles from '../../style/UploadProgress';

interface Props extends WithStyles<typeof styles> {
    progress: string | number;
}

function UploadProgress(props: Props) {
    const { container, barColorPrimary, colorPrimary, root } = props.classes;
    let progress = props.progress;
    typeof progress === 'string' && (progress = Number.parseInt(progress, 10));

    return (
        <div className={container}>
            <LinearProgress
                value={progress}
                variant='determinate'
                color='primary'
                classes={{ root, barColorPrimary, colorPrimary }}
            />
        </div>
    );
}

export default withStyles(styles)(UploadProgress);
