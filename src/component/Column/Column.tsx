import React, { Component } from "react";
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import { Candidate as CType, STEP } from '../../lib/const';
import styles from "../../style/column";
import withRoot from "../../style/withRoot";
import ColumnDialog from './ColumnDialog';
import ColumnModal from './ColumnModal';
import ColumnCandidate from './ColumnCandidate';

interface Props extends WithStyles {
    dropIndex: number;
    title: string;
    isDragging: boolean;
    candidates: Map<string, CType>;
    group: string;
    selected: string[];
    modalOn: string;
    fabOn: number;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    remove: (cid: string) => void;
    toggleOn: (info: string, color?: string) => void;
    toggleModalOn: (cid: string) => void;
    toggleModalOff: () => void;
    changeInputting: (comment: string, evaluation: string) => void;
    toggleFabOff: () => void;
    downloadResume: (cid: string) => void;
}

const titleToStep = (title: string) => STEP.indexOf(title);

class Column extends Component<Props> {

    state = {
        dialog: false,
        modal: false,
        removeConfirm: false,
        direction: 'left' as "left" | "right" | "up" | "down",
        buttons: false
    };

    toggleButtons = () => {
        this.setState({
            buttons: !this.state.buttons
        })
    };

    shouldComponentUpdate() {
        return !this.props.isDragging;
    }

    handleNext = (cid: string) => () => {
        this.props.toggleModalOn(cid);
        this.props.changeInputting('', '');
        this.setState({
            direction: 'left'
        });
    };

    handlePrev = (cid: string) => () => {
        this.props.toggleModalOn(cid);
        this.props.changeInputting('', '');
        this.setState({
            direction: 'right'
        });
    };

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { toggleOn, remove } = this.props;
        if (selected.length === 0) {
            toggleOn('你没有选中任何人');
            return;
        }
        selected.map(i => remove(i));
    };

    handleSelectAll = (all: string[]) => () => {
        const { select, candidates } = this.props;
        select(all.filter(i => !candidates.get(i)!.abandon));
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect, candidates } = this.props;
        deselect(selected.filter(i => !candidates.get(i)!.abandon));
        select(all.filter((i: string) => !selected.includes(i) && !candidates.get(i)!.abandon));
    };

    confirmRemove = () => {
        this.toggleOpen('dialog')();
    };

    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name]
        });
    };

    componentWillReceiveProps(nextProps: Props) {
        const { group, title } = this.props;
        if (nextProps.group !== group) {
            this.props.toggleModalOff();
        }
        if (nextProps.selected.length === 0 && nextProps.fabOn === titleToStep(title)) {
            this.props.toggleFabOff();
            if (this.state.buttons) {
                this.toggleButtons();
            }
        }
    }

    render() {
        const { classes, title, candidates, group, selected, deselect, modalOn, toggleModalOff, dropIndex, toggleFabOff, fabOn, downloadResume } = this.props;
        const allCandidatesCids = [...candidates.keys()];
        const selectedCandidatesCids = selected.filter((i: string) => allCandidatesCids.includes(i));
        const selectedCandidatesInfo = selectedCandidatesCids.map((i: string) => candidates.get(i) as CType);

        const ButtonBox = (
            <div className={classes.fabButtonsContainer}>
                <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    className={classes.fabButton}
                    onClick={this.handleSelectAll(allCandidatesCids)}
                >全选</Button>
                <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    className={classes.fabButton}
                    onClick={this.handleInverse(allCandidatesCids, selectedCandidatesCids)}
                >反选</Button>
                <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    className={classes.fabButton}
                    onClick={this.toggleOpen('modal')}
                    disabled={selectedCandidatesCids.length === 0}
                >发送通知</Button>
                <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    className={classes.fabButton}
                    onClick={this.confirmRemove}
                >移除</Button>
                <Button
                    color='primary'
                    size='small'
                    variant='contained'
                    className={classes.fabButton}
                    onClick={() => {
                        toggleFabOff();
                        this.toggleButtons();
                        deselect(selected);
                    }}
                >隐藏</Button>
            </div>
        );

        const CandidateBox = (i: [string, CType], j: number) => (
            <ColumnCandidate
                i={i}
                j={j}
                key={j}
                disabled={i[1].abandon || i[1].rejected || selectedCandidatesCids.includes(i[0])}
                toggleModalOff={toggleModalOff}
                modalOn={modalOn}
                step={titleToStep(title)}
                direction={this.state.direction}
                handlePrev={this.handlePrev(allCandidatesCids[j - 1])}
                handleNext={this.handleNext(allCandidatesCids[j + 1])}
                downloadResume={downloadResume}
            />
        );
        const DroppableBox = (
            <Droppable droppableId={title} type="CANDIDATE">
                {(dropProvided: DroppableProvided) => (
                    <div className={classes.columnBody}
                         ref={element => dropProvided.innerRef(element)}
                         {...dropProvided.droppableProps}
                    >
                        {[...candidates.entries()].map(CandidateBox)}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>
        );
        return (
            <>
                <Draggable draggableId={title} index={dropIndex}>
                    {(provided: DraggableProvided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                            <Paper className={classes.column}>
                                <div className={classes.columnHeader}>
                                    <Typography variant='title'
                                                className={classes.columnTitle}
                                                {...provided.dragHandleProps}
                                    >{title}</Typography>
                                </div>
                                <Divider />
                                {DroppableBox}
                                <ColumnDialog
                                    open={this.state.dialog}
                                    onClick={this.handleRemove(selectedCandidatesCids)}
                                    toggleOpen={this.toggleOpen('dialog')} />
                                <ColumnModal
                                    open={this.state.modal}
                                    toggleOpen={this.toggleOpen('modal')}
                                    selected={selectedCandidatesInfo}
                                    deselect={deselect}
                                    group={group} />
                            </Paper>
                        </div>
                    )}
                </Draggable>
                {<>
                    <Zoom in={fabOn === titleToStep(title)}>
                        <Button variant="fab" className={classes.fab} color='primary' onClick={this.toggleButtons}>
                            <AddIcon />
                        </Button>
                    </Zoom>
                    <Zoom in={this.state.buttons}>
                        {ButtonBox}
                    </Zoom>
                </>}
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
