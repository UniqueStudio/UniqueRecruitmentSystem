import * as React from "react";
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { DragDropContext, DraggableLocation, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

import withRoot from "../../style/withRoot";
import styles from "../../style";
import Column from "../../container/Column/Column";

import { STEP } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    pathname: string;
    modalItem: {
        modalOn: boolean;
        title: string;
        step: number;
        cid: string;
        comments: object[];
        direction: string;
    }
    changeGroup: (group: string) => void;
    closeModal: () => void;
    move: (from: number, to: number, cid: string, position: number) => void;
}

class Container extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
        props.changeGroup(props.group);
    }

    state = {
        steps: this.props.pathname === '/view' ? STEP : STEP.slice(4),
        flag: false,
    };

    onDragStart = () => {
        this.setState({
            flag: true
        })
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
            const preorder = this.state.steps;
            const ordered = [...preorder];
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
