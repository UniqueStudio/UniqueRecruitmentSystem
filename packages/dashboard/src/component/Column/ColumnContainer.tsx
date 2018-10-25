import React, { PureComponent } from 'react';
import { DragDropContext, DraggableLocation, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import { RouteComponentProps } from 'react-router-dom';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/column';

import Column from '../../container/Column/Column';
import Fab from '../Fab';
import ColumnDialog from './ColumnDialog';
import ColumnModal from './ColumnModal';

import { Candidate, STEPS } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    userGroup: string;
    candidates: Map<string, Candidate>[];
    selected: string[];
    fabOn: number;
    snackbarOn: boolean;
    pendingRecruitment: string;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    changeGroup: (group: string, recruitmentName: string) => void;
    toggleFabOff: () => void;
    move: (from: number, to: number, cid: string, position: number) => void;
    remove: (cid: string) => void;
    toggleSnackbarOn: (info: string, color?: string) => void;
}

class Container extends PureComponent<Props & RouteComponentProps<{}>> {
    state = (() => {
        const { pathname } = this.props.location;
        return {
            steps: pathname === '/massInterview' ? STEPS.slice(4) : STEPS,
            flag: false,
            dialog: false,
            modal: false,
        };
    })();

    onDragEnd = (result: DropResult) => {
        const { move } = this.props;

        const newState = {
            flag: false,
        };

        if (result.destination) {
            const source: DraggableLocation = result.source;
            const destination: DraggableLocation = result.destination;
            const { droppableId, index } = destination;

            switch (result.type) {
                case 'COLUMN':
                    if (source.droppableId === droppableId && source.index === index) return;
                    const preOrder = this.state.steps;
                    const ordered = [...preOrder];
                    const [removed] = ordered.splice(source.index, 1);
                    ordered.splice(index, 0, removed);
                    newState['steps'] = ordered;
                    this.setState(newState);
                    return;
                case 'CANDIDATE':
                    if (source.droppableId === droppableId) return;
                    this.setState(newState);
                    move(STEPS.indexOf(source.droppableId), STEPS.indexOf(droppableId), result.draggableId, index);
                    return;
            }
        }
    };

    onDragStart = () => {
        this.setState({
            flag: true,
        });
    };

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { toggleSnackbarOn, remove } = this.props;
        if (selected.length === 0) {
            toggleSnackbarOn('你没有选中任何人');
            return;
        }
        selected.map((cid) => remove(cid));
    };

    toggleOpen = (name: string) => () => {
        const { deselect, selected } = this.props;
        this.state.modal && deselect(selected);
        this.setState({
            [name]: !this.state[name],
        });
    };

    componentDidMount() {
        const { changeGroup, group, location, userGroup, pendingRecruitment } = this.props;
        const { pathname } = location;
        const changeTo = pathname === '/massInterview' ? 'interview' : group === 'interview' ? userGroup : group;
        changeGroup(changeTo, pendingRecruitment);
    }

    componentDidUpdate(prevProps: Props) {
        const { group, location } = this.props;
        const { pathname } = location;
        if (prevProps.group !== group) {
            this.setState({
                steps: pathname === '/massInterview' ? STEPS.slice(4) : STEPS,
            });
        }
    }

    render() {
        const { classes, selected, candidates, fabOn, snackbarOn, select, deselect, toggleFabOff, group, userGroup, location } = this.props;
        const { steps, modal, dialog, flag } = this.state;
        const current = candidates[Math.max(fabOn, 0)] || new Map<string, Candidate>();
        const allCid = [...current.keys()];
        const selectedCid = selected.filter((cid) => allCid.includes(cid));
        const selectedInfo = selectedCid.map((cid) => current.get(cid) as Candidate);
        const isMassInterview = location.pathname === '/massInterview';

        return (
            <>
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <Droppable
                        droppableId='board'
                        type='COLUMN'
                        direction='horizontal'
                    >
                        {({ innerRef, droppableProps }: DroppableProvided) => (
                            <div
                                key={innerRef.toString()}
                                className={classes.columnContainer}
                                ref={innerRef}
                                {...droppableProps}
                            >
                                {steps.map((step) =>
                                    <Column
                                        title={step}
                                        key={step}
                                        dropIndex={steps.indexOf(step)}
                                        isDragging={flag}
                                        shouldSort={isMassInterview}
                                    />
                                )}
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
                    open={dialog}
                    onClick={this.handleRemove(selectedCid)}
                    toggleOpen={this.toggleOpen('dialog')} />
                <ColumnModal
                    open={modal}
                    toggleOpen={this.toggleOpen('modal')}
                    selected={selectedInfo}
                    deselect={deselect}
                    group={group} />
            </>
        );
    }
}

export default withStyles(styles)(Container);
