import { useTheme, useMediaQuery } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import SwipeableViews from 'react-swipeable-views';

import { moveCandidate } from '@apis/websocket';
import Card from '@components/Card';
import Column from '@components/Column';
import { STEPS } from '@config/consts';
import { Candidate, Step } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/board';

interface Props {
    candidates: Candidate[][];
    toggleDetail: (detail: number) => (index: number) => () => void;
}

const Board: FC<Props> = observer(({ candidates, toggleDetail }) => {
    const classes = useStyles();
    const { $candidate } = useStores();
    const [column, setColumn] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

    const onDragEnd = useCallback(({ destination, source, type, draggableId }: DropResult) => {
        if (destination) {
            const { droppableId, index } = destination;

            switch (type) {
                case 'COLUMN': {
                    if (source.droppableId === droppableId && source.index === index) return;
                    const ordered = [...$candidate.steps];
                    const [removed] = ordered.splice(source.index, 1);
                    ordered.splice(index, 0, removed);
                    $candidate.setSteps(0, ordered);
                    return;
                }
                case 'CANDIDATE':
                    if (source.droppableId === droppableId) return;
                    moveCandidate(
                        draggableId,
                        STEPS.indexOf(source.droppableId) as Step,
                        STEPS.indexOf(droppableId) as Step,
                        index,
                    );
                    return;
            }
        }
    }, []);

    const Columns = $candidate.steps.map((step, i) => (
        <Column title={STEPS[step]} key={STEPS[step]} dropIndex={i}>
            {candidates[step].map((candidate, j) => (
                <Card
                    candidate={candidate}
                    index={j}
                    key={candidate._id}
                    isTeamInterview={$candidate.steps.length === 2}
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
                            {isMobile ? (
                                <SwipeableViews index={column} onChangeIndex={(index) => setColumn(index)}>
                                    {Columns}
                                </SwipeableViews>
                            ) : (
                                Columns
                            )}
                            {placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
});

export default Board;
