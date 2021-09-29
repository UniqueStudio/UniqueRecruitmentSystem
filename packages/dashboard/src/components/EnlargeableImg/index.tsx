import { Dialog } from '@mui/material';
import React, { FC, memo, useState } from 'react';

import useStyles from '@styles/enlargeableImg';

interface Props {
    src: string;
}

export const EnlargeableImage: FC<Props> = memo(({ src }) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <img src={src} onClick={handleOpen} className={classes.image} alt='small' />
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={false}
                classes={{ paper: classes.imageLayer, root: classes.imageRoot }}
            >
                <img src={src} onClick={handleClose} className={classes.image} alt='original' />
            </Dialog>
        </>
    );
});
