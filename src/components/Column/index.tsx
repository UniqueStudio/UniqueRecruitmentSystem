import React, { FC, memo } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

import useStyles from '../../styles/column';

interface Props {
    title: string;
    dropIndex: number;
}

const Column: FC<Props> = memo(({ title, children, dropIndex }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const ColumnBody = (
        <Droppable droppableId={title} type='CANDIDATE' isDropDisabled={isMobile}>
            {({ innerRef, droppableProps, placeholder }) => (
                <div className={classes.columnBody} ref={innerRef} {...droppableProps}>
                    {children}
                    {placeholder}
                </div>
            )}
        </Droppable>
    );

    return (
        <Draggable draggableId={title} index={dropIndex} isDragDisabled={isMobile}>
            {({ innerRef, dragHandleProps, draggableProps }) => (
                <div ref={innerRef} {...draggableProps}>
                    <Paper className={classes.column}>
                        <div className={classes.columnHeader}>
                            <Typography variant='h6' className={classes.columnTitle} {...dragHandleProps}>
                                {title}
                            </Typography>
                        </div>
                        <Divider />
                        {ColumnBody}
                    </Paper>
                </div>
            )}
        </Draggable>
    );
});

export default Column;
