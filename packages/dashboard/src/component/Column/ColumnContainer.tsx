import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { DragDropContext, DraggableLocation, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';

import withRoot from "../../style/withRoot";
import styles from "../../style/column";
import Column from "../../container/Column/Column";

import { Candidate, STEPS } from '../../lib/const';
import Fab from '../Fab';
import ColumnDialog from './ColumnDialog';
import ColumnModal from './ColumnModal';

interface Props extends WithStyles {
    group: string;
    userGroup: string;
    type: string;
    candidates: Map<string, Candidate>[];
    selected: string[];
    fabOn: number;
    snackbarOn: boolean;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    changeGroup: (group: string) => void;
    toggleFabOff: () => void;
    move: (from: number, to: number, cid: string, position: number) => void;
    remove: (cid: string) => void;
    toggleSnackbarOn: (info: string, color?: string) => void;
}

class Container extends PureComponent<Props> {
    state = {
        steps: this.props.type === 'final' ? STEPS.slice(4) : STEPS,
        flag: false,
        dialog: false,
        modal: false,
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
            this.props.move(STEPS.indexOf(source.droppableId), STEPS.indexOf(destination.droppableId), result.draggableId, destination.index);
        }
    };

    onDragStart = () => {
        this.setState({
            flag: true
        })
    };

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { toggleSnackbarOn, remove } = this.props;
        if (selected.length === 0) {
            toggleSnackbarOn('你没有选中任何人');
            return;
        }
        selected.map(i => remove(i));
    };


    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name]
        });
    };

    componentDidMount() {
        const { changeGroup, group, type } = this.props;
        type === 'final' ? changeGroup('interview') : changeGroup(group === 'interview' ? 'web' : group);
    }

    render() {
        const { classes, selected, candidates, fabOn, snackbarOn, select, deselect, toggleFabOff, group, userGroup } = this.props;
        const current = candidates[Math.max(fabOn, 0)] || new Map<string, Candidate>();
        const allCid = [...current.keys()];
        const selectedCid = selected.filter(i => allCid.includes(i));
        const selectedInfo = selectedCid.map(i => current.get(i) as Candidate);

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
                <Fab selected={selected} deselect={deselect} fabOn={fabOn} snackbarOn={snackbarOn} select={select}
                     candidates={current} toggleFabOff={toggleFabOff}
                     toggleOpen={this.toggleOpen} canOperate={userGroup === group} />
                <ColumnDialog
                    open={this.state.dialog}
                    onClick={this.handleRemove(selectedCid)}
                    toggleOpen={this.toggleOpen('dialog')} />
                <ColumnModal
                    open={this.state.modal}
                    toggleOpen={this.toggleOpen('modal')}
                    selected={selectedInfo}
                    deselect={deselect}
                    group={group} />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Container));
