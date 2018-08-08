import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { DragDropContext, DraggableLocation, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

import withRoot from "../../style/withRoot";
import styles from "../../style/column";
import Column from "../../container/Column/Column";

import { STEP } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    type: string;
    changeGroup: (group: string) => void;
    move: (from: number, to: number, cid: string, position: number) => void;
}

class Container extends PureComponent<Props> {
    state = {
        steps: this.props.type === 'final' ? STEP.slice(4) : STEP,
        flag: false,
    };
    onDragEnd = (result: DropResult) => {
        this.setState({
            flag: false
        });
        if (!result.destination) return;

        const source: DraggableLocation = result.source;
        const destination: DraggableLocation = result.destination;

        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        if (result.type === 'COLUMN') {
            const preOrder = this.state.steps;
            const ordered = [...preOrder];
            const [removed] = ordered.splice(source.index, 1);
            ordered.splice(destination.index, 0, removed);
            this.setState({
                steps: ordered,
            });
            return;
        } else if (result.type = 'CANDIDATE') {
            this.props.move(STEP.indexOf(source.droppableId), STEP.indexOf(destination.droppableId), result.draggableId, destination.index);
        }
    };

    onDragStart = () => {
        this.setState({
            flag: true
        })
    };

    componentDidMount() {
        const { changeGroup, group, type } = this.props;
        type === 'final' ? changeGroup('interview') : changeGroup(group === 'interview' ? 'web' : group);
    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <Droppable
                        droppableId="board"
                        type="COLUMN"
                        direction="horizontal"
                    >
                        {(provided: DroppableProvided) => (
                            <div
                                key={provided.innerRef.toString()}
                                className={classes.columnContainer}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {this.state.steps.map(i => <Column title={i} key={i}
                                                                   dropIndex={this.state.steps.indexOf(i)}
                                                                   isDragging={this.state.flag} />)}
                                {/*this div with a full-width-space is used to show right margin of the last element*/}
                                <div style={{ visibility: 'hidden' }}>{'　'}</div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Container));
