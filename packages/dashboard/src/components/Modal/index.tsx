import { Modal as MuiModal, ModalTypeMap, Paper, Slide, SlideProps, Typography } from '@mui/material';
import React, { FC, memo } from 'react';

import useStyles from '@styles/modal';

type Props = Exclude<
    ModalTypeMap['props'] & {
        direction?: SlideProps['direction'];
        title: string;
    },
    'children'
>;

export const Modal: FC<Props> = memo(({ open, title, children, direction = 'right', ...other }) => {
    const classes = useStyles();
    const leaveDirection = direction === 'left' ? 'right' : 'left';
    return (
        <MuiModal open={open} className={classes.modalContainer} disableEnforceFocus {...other}>
            <Slide direction={open ? direction : leaveDirection} in={open} mountOnEnter unmountOnExit>
                <Paper className={classes.modal}>
                    <div className={classes.modalHeader}>
                        <Typography variant='h5' className={classes.modalTitle}>
                            {title}
                        </Typography>
                    </div>
                    {children}
                </Paper>
            </Slide>
        </MuiModal>
    );
});
