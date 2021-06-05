import React, { FC, memo, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';

import useStyles from '../../styles/enlargeableImg';

interface Props {
    src: string;
}

const EnlargeableImage: FC<Props> = memo(({ src }) => {
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
                classes={{ paper: classes.imageLayer, root: classes.imageRoot }}>
                <img src={src} onClick={handleClose} className={classes.image} alt='original' />
            </Dialog>
        </>
    );
});

export default EnlargeableImage;
