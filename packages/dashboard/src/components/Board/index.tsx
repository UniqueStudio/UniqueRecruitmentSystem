import { useMediaQuery, useTheme } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { moveCandidate } from '@apis/rest';
import { Card } from '@components/Card';
import { Column } from '@components/Column';
import { STEP_MAP } from '@config/consts';
import { Step } from '@config/enums';
import { Candidate } from '@config/types';
import { useStores } from '@hooks/useStores';
import { TabLayout } from '@layouts/TabLayout';
import useStyles from '@styles/board';

interface Props {
    candidates: Candidate[][];
    toggleDetail: (detail: number) => (index: number) => () => void;
}

export const Board: FC<Props> = observer(({ candidates, toggleDetail }) => {
    const classes = useStyles();
    const { $candidate } = useStores();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const onDragEnd = useCallback(({ destination, source, type, draggableId }: DropResult) => {
        if (!destination) {
            return;
        }
        const { droppableId, index } = destination;
        switch (type) {
            case 'COLUMN': {
                if (source.droppableId === droppableId && source.index === index) return;
                const ordered = [...$candidate.steps];
                const [removed] = ordered.splice(source.index, 1);
                ordered.splice(index, 0, removed);
                $candidate.setSteps($candidate.stepType, ordered);
                return;
            }
            case 'CANDIDATE':
                if (source.droppableId === droppableId) return;
                void moveCandidate(draggableId, +source.droppableId, +droppableId);
                return;
        }
    }, []);

    const CardsInStep = (step: Step) =>
        candidates[step].map((candidate, j) => (
            <Card candidate={candidate} index={j} key={candidate.id} toggleDetail={toggleDetail(step)(j)} />
        ));

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='board' type='COLUMN' direction='horizontal' isDropDisabled={isMobile}>
                {({ innerRef, placeholder, droppableProps }) => (
                    <div className={classes.columnsContainer} ref={innerRef} {...droppableProps}>
                        {isMobile ? (
                            <TabLayout
                                items={$candidate.steps.map((step) => ({
                                    label: STEP_MAP.get(step)!,
                                    value: step.toString(),
                                    component: <>{CardsInStep(step)}</>,
                                }))}
                                variant='scrollable'
                                classes={{ paper: classes.tabContainer }}
                            />
                        ) : (
                            $candidate.steps.map((step, i) => (
                                <Column step={step} key={step} dropIndex={i}>
                                    {CardsInStep(step)}
                                </Column>
                            ))
                        )}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});
