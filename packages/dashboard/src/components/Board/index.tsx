import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import SwipeableViews from 'react-swipeable-views';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery';

import Column from '../../components/Column';

import { STEPS } from '../../config/consts';
import { Step } from '../../config/types';

import { Props } from '../../containers/Board';
import Card from '../../containers/Card';

import useStyles from '../../styles/board';

const Board: FC<Props> = memo(({ candidates, toggleDetail, steps: stepsP, move }) => {
    const classes = useStyles();
    const [steps, setSteps] = useState(stepsP);
    const [column, setColumn] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    useEffect(() => {
        setSteps(stepsP);
        setColumn(0);
    }, [stepsP]);

    const onDragEnd = useCallback(({ destination, source, type, draggableId }: DropResult) => {
        if (destination) {
            const { droppableId, index } = destination;

            switch (type) {
                case 'COLUMN':
                    if (source.droppableId === droppableId && source.index === index) return;
                    const ordered = [...steps];
                    const [removed] = ordered.splice(source.index, 1);
                    ordered.splice(index, 0, removed);
                    setSteps(ordered);
                    return;
                case 'CANDIDATE':
                    if (source.droppableId === droppableId) return;
                    move(STEPS.indexOf(source.droppableId) as Step, STEPS.indexOf(droppableId) as Step, draggableId, index);
                    return;
            }
        }
    }, [move, steps]);

    const Columns = steps.map((step, i) => (
        <Column
            title={STEPS[step]}
            key={STEPS[step]}
            dropIndex={i}
        >
            {candidates[step].map((candidate, j) => (
                <Card
                    candidate={candidate}
                    index={j}
                    key={candidate._id}
                    isTeamInterview={steps.length === 2}
                    toggleDetail={toggleDetail(step)(j)}
                />
            ))}
        </Column>
    ));

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={classes.board}>
                <Droppable droppableId='board' type='COLUMN' direction='horizontal' isDropDisabled={isMobile}>
                    {({ innerRef, placeholder, droppableProps }) => (
                        <div className={classes.columnsContainer} ref={innerRef} {...droppableProps}>
                            {isMobile ? <SwipeableViews index={column} onChangeIndex={(index) => setColumn(index)}>
                                {Columns}
                            </SwipeableViews> : Columns}
                            {placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}, (prev, next) => {
    if (prev.steps.length !== next.steps.length) return false;
    const candidatesP = prev.candidates;
    const candidatesN = next.candidates;
    for (let i = 0; i < STEPS.length; i++) {
        if (candidatesP[i].length !== candidatesN[i].length) return false;
        for (let j = 0; j < candidatesP[i].length; j++) {
            const candidateP = candidatesP[i][j];
            const candidateN = candidatesN[i][j];
            if (candidateP._id !== candidateN._id) return false;
            if (candidateP.abandon !== candidateN.abandon) return false;
            if (candidateP.rejected !== candidateN.rejected) return false;
            if (candidateP.interviews.team.allocation !== candidateN.interviews.team.allocation) return false;
            if (candidateP.comments.length !== candidateN.comments.length) return false;
        }
    }
    return true;
});

export default Board;
