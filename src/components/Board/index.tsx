import React, { PureComponent } from 'react';
import {
    DragDropContext,
    Droppable,
    DropResult
} from 'react-beautiful-dnd';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../styles/column';

import Column from '../../containers/Column';

import { STEPS } from '../../config/consts';
import { Candidate, Group, Step } from '../../config/types';

interface Props extends WithStyles<typeof styles> {
    steps: Step[];
    group: Group;
    candidates: Candidate[][];
    toggleDetail: (detail: number) => (index: number) => () => void;
    move: (from: Step, to: Step, cid: string, position: number) => void;
}

interface State {
    steps: Step[];
}

class Board extends PureComponent<Props, State> {

    state = {
        steps: this.props.steps,
    };

    componentDidUpdate({ group: prevGroup, steps: prevSteps }: Props) {
        this.setState((prevState, { steps, group }) => ({
            steps: steps.length !== prevState.steps.length || group !== prevGroup ? steps : prevSteps
        }));
    }

    onDragEnd = ({ destination, source, draggableId, type }: DropResult) => {
        if (destination) {
            const { droppableId: destDroppableId, index: destIndex } = destination;
            const { droppableId: sourceDroppableId, index: sourceIndex } = source;
            switch (type) {
                case 'COLUMN':
                    if (sourceDroppableId === destDroppableId && sourceIndex === destIndex) return;
                    const preOrder = this.state.steps;
                    const ordered = [...preOrder];
                    const [removed] = ordered.splice(source.index, 1);
                    ordered.splice(destIndex, 0, removed);
                    this.setState({
                        steps: ordered
                    });
                    return;
                case 'CANDIDATE':
                    if (sourceDroppableId === destDroppableId) return;
                    this.props.move(STEPS.indexOf(source.droppableId) as Step, STEPS.indexOf(destDroppableId) as Step, draggableId, destIndex);
                    return;
            }
        }
    };

    render() {
        const { classes, candidates, toggleDetail } = this.props;
        const { steps } = this.state;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className={classes.div}>
                    <Droppable droppableId='board' type='COLUMN' direction='horizontal'>
                        {({ innerRef, droppableProps }) => (
                            <div className={classes.columnContainer} ref={innerRef} {...droppableProps}>
                                {steps.map((step, index) =>
                                    <Column
                                        step={step}
                                        key={index}
                                        candidates={candidates[step]}
                                        dropIndex={index}
                                        isTeamInterview={steps.length === 2}
                                        toggleDetail={toggleDetail(step)}
                                    />
                                )}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        );
    }
}

export default withStyles(styles)(Board);
