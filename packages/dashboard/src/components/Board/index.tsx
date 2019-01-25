import { Candidate, Step } from 'Config/types';
import React, { PureComponent } from 'react';
import {
    DragDropContext,
    Droppable,
    DropResult
} from 'react-beautiful-dnd';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from 'Styles/column';

import Column from 'Containers/Column';

import { STEPS } from 'Config/consts';

interface Props extends WithStyles {
    steps: Step[];
    candidates: Candidate[][];
    toggleDetail: (detail: number) => (index: number) => () => void;
    move: (from: number, to: number, cid: string, position: number) => void;
}

interface State {
    steps: Step[];
}

class Board extends PureComponent<Props, State> {

    state = {
        steps: this.props.steps,
    };

    componentDidUpdate() {
        this.setState((prevState, { steps }) => ({
            steps: steps.length !== prevState.steps.length ? steps : prevState.steps
        }));
    }

    onDragEnd = (result: DropResult) => {

        if (result.destination) {
            const source = result.source;
            const destination = result.destination;
            const { droppableId, index } = destination;

            switch (result.type) {
                case 'COLUMN':
                    if (source.droppableId === droppableId && source.index === index) return;
                    const preOrder = this.state.steps;
                    const ordered = [...preOrder];
                    const [removed] = ordered.splice(source.index, 1);
                    ordered.splice(index, 0, removed);
                    this.setState({
                        steps: ordered
                    });
                    return;
                case 'CANDIDATE':
                    if (source.droppableId === droppableId) return;
                    this.props.move(STEPS.indexOf(source.droppableId), STEPS.indexOf(droppableId), result.draggableId, index);
                    return;
            }
        }
    };

    render() {
        const { classes, candidates, toggleDetail } = this.props;
        const { steps } = this.state;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId='column' type='COLUMN' direction='horizontal'>
                    {({ innerRef, droppableProps }) => (
                        <div className={classes.columnContainer} ref={innerRef} {...droppableProps}>
                            {steps.map((step, index) =>
                                <Column
                                    step={step}
                                    key={step}
                                    candidates={candidates[step]}
                                    dropIndex={index}
                                    isTeamInterview={steps.length === 2}
                                    toggleDetail={toggleDetail(step)}
                                />
                            )}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default withStyles(styles)(Board);
