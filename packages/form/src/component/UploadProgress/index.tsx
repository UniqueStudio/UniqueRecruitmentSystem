import { LinearProgress } from '@material-ui/core';
import React, { FC, memo } from 'react';

import useStyles from '../../style/UploadProgress';

interface UploadProgressProps {
    progress: string | number;
}

const UploadProgress: FC<UploadProgressProps> = memo(({ progress }) => {
    const { container, barColorPrimary, colorPrimary, root } = useStyles();
    return (
        <div className={container}>
            <LinearProgress
                value={typeof progress === 'string' ? Number.parseInt(progress, 10) : progress}
                variant='determinate'
                color='primary'
                classes={{ root, barColorPrimary, colorPrimary }}
            />
        </div>
    );
});

export default UploadProgress;
