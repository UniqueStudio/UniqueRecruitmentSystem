import { useMediaQuery, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { moveApplication } from '@apis/rest';
import { Card } from '@components/Card';
import { Column } from '@components/Column';
import { STEP_MAP } from '@config/consts';
import { Step } from '@config/enums';
import { Application } from '@config/types';
import { useStores } from '@hooks/useStores';
import { TabLayout } from '@layouts/TabLayout';
import useStyles from '@styles/board';

interface Props {
    applications: Application[][];
    toggleDetail: (step: number, index: number) => () => void;
}

export const Board: FC<Props> = observer(({ applications: applications, toggleDetail }) => {
    const classes = useStyles();
    const { $application } = useStores();
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
                const ordered = [...$application.steps];
                const [removed] = ordered.splice(source.index, 1);
                ordered.splice(index, 0, removed);
                $application.setSteps($application.stepType, ordered);
                return;
            }
            case 'CARD':
                if (source.droppableId === droppableId) return;
                void moveApplication(draggableId, +source.droppableId, +droppableId);
                return;
        }
    }, []);

    const CardsInStep = (step: Step) =>
        applications[step].map(
            (application, j) =>
                applications[step] && (
                    <Card
                        application={application}
                        index={j}
                        key={application.id}
                        toggleDetail={toggleDetail(step, j)}
                    />
                ),
        );

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='board' type='COLUMN' direction='horizontal' isDropDisabled={isMobile}>
                {({ innerRef, placeholder, droppableProps }) => (
                    <div className={classes.columnsContainer} ref={innerRef} {...droppableProps}>
                        {isMobile ? (
                            <TabLayout
                                items={
                                    $application.steps
                                        ? $application.steps.map((step) => ({
                                              label: STEP_MAP.get(step)!,
                                              value: step.toString(),
                                              component: <>{CardsInStep(step)}</>,
                                              to: step.toString(),
                                          }))
                                        : []
                                }
                                variant='scrollable'
                                classes={{ paper: classes.tabContainer }}
                            />
                        ) : (
                            $application.steps.map(
                                (step, i) =>
                                    $application.steps && (
                                        <Column step={step} key={step} dropIndex={i}>
                                            {CardsInStep(step)}
                                        </Column>
                                    ),
                            )
                        )}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});
