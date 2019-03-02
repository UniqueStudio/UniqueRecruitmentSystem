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

    componentDidUpdate(prevProps: Props) {
        this.setState((prevState, { steps, group }) => ({
            steps: steps.length !== prevState.steps.length || group !== prevProps.group ? steps : prevState.steps
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
                    this.props.move(STEPS.indexOf(source.droppableId) as Step, STEPS.indexOf(droppableId) as Step, result.draggableId, index);
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
