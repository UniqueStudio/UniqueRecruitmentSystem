import * as React from "react";
import { Draggable, DraggableProvided, Droppable, DroppableProvided, } from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Detail from '../Candidate/CandidateDetail';
import Comments from '../../container/Candidate/CandidateComments';
import Candidate from "../../container/Candidate/Candidate";
import Modal from '../Modal';
import Template from '../Template';
import { STEP } from '../../lib/const';
import styles from "../../style/index";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    dropIndex: number;
    title: string;
    candidates: object;
    group: string;
    selected: string[];
    modalOn: string;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    remove: (cid: string) => void;
    toggleOn: (info: string) => void;
    toggleModalOn: (cid: string) => void;
    toggleModalOff: () => void;
    changeInputting: (comment: string, evaluation: string) => void;
}

const titleToStep = (title: string) => STEP.indexOf(title);

class Column extends React.Component<Props> {

    state = {
        dialog: false,
        modal: false,
        removeConfirm: false,
        direction: 'left'
    };

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

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.group !== this.props.group) {
            this.props.toggleModalOff();
        }
    }

    handleSelectAll = (all: string[]) => () => {
        const { select, candidates } = this.props;
        select(all.filter(i => !candidates[i].abandon));
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect, candidates } = this.props;
        deselect(selected.filter(i => !candidates[i].abandon));
        select(all.filter((i: string) => !selected.includes(i) && !candidates[i].abandon));
    };

    confirmRemove = () => {
        this.toggleOpen('dialog')();
    };

    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name]
        });
    };

    render() {
        const { classes, title, candidates, group, selected, deselect, modalOn, toggleModalOff, dropIndex } = this.props;
        const allCandidatesCids = Object.keys(candidates);
        const selectedCandidatesCids = selected.filter((i: string) => allCandidatesCids.includes(i));
        const selectedCandidatesInfo = selectedCandidatesCids.map((i: string) => {
            const current = candidates[i];
            return { cid: i, ...current };
        });

        return (
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
                            <Droppable
                                droppableId={title}
                                type="CANDIDATE"
                            >
                                {(dropProvided: DroppableProvided) => (
                                    <div className={classes.columnBody}
                                         ref={dropProvided.innerRef}
                                         {...dropProvided.droppableProps}
                                    >
                                        {candidates && Object.entries(candidates).map((i, j) => (
                                            <React.Fragment key={i[0]}>
                                                <Draggable draggableId={i[0]} index={j} isDragDisabled={i[1].abandon}>
                                                    {(dragProvided: DraggableProvided) => (
                                                        <Candidate step={titleToStep(title)}
                                                                   cid={i[0]}
                                                                   info={i[1]}
                                                                   provided={dragProvided}
                                                        />
                                                    )}
                                                </Draggable>
                                                <Modal open={i[0] === modalOn}
                                                       onClose={toggleModalOff}
                                                       direction={this.state.direction}
                                                       title='详细信息'
                                                >
                                                    <div className={classes.modalContent}>
                                                        <IconButton className={classes.leftButton}
                                                                    onClick={this.handlePrev(allCandidatesCids[j - 1])}>
                                                            <ExpandMoreIcon />
                                                        </IconButton>
                                                        <div className={classes.modalMain}>
                                                            <Detail info={i[1]} />
                                                            <Comments step={titleToStep(title)} cid={i[0]}
                                                                      comments={i[1].comments} />
                                                        </div>
                                                        <IconButton className={classes.rightButton}
                                                                    onClick={this.handleNext(allCandidatesCids[j + 1])}>
                                                            <ExpandMoreIcon />
                                                        </IconButton>
                                                    </div>
                                                </Modal>
                                            </React.Fragment>
                                        ))}
                                        {dropProvided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <Divider />
                            <div className={classes.columnBottom}>
                                <Button
                                    color='primary'
                                    size='small'
                                    className={classes.columnButton}
                                    onClick={this.handleSelectAll(allCandidatesCids)}
                                >全选</Button>
                                <Button
                                    color='primary'
                                    size='small'
                                    className={classes.columnButton}
                                    onClick={this.handleInverse(allCandidatesCids, selectedCandidatesCids)}
                                >反选</Button>
                                <Button
                                    color='primary'
                                    size='small'
                                    className={classes.columnButton}
                                    onClick={this.toggleOpen('modal')}
                                    disabled={selectedCandidatesCids.length === 0}
                                >发送通知</Button>
                                <Button
                                    color='primary'
                                    size='small'
                                    variant='contained'
                                    className={classes.columnButton}
                                    onClick={this.confirmRemove}
                                >移除</Button>
                            </div>
                            <Dialog
                                open={this.state.dialog}
                                onClose={this.toggleOpen('dialog')}
                            >
                                <DialogTitle>提醒</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        这将永远移除该候选人，你确定吗？
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.toggleOpen('dialog')} color="primary" autoFocus>
                                        否
                                    </Button>
                                    <Button onClick={this.handleRemove(selectedCandidatesCids)} color="primary">
                                        确定移除
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Modal open={this.state.modal} onClose={this.toggleOpen('modal')} title='发送通知'>
                                <Template toggleOpen={this.toggleOpen('modal')}
                                          selected={selectedCandidatesInfo}
                                          deselect={deselect}
                                          flowStep={titleToStep(title)}
                                          group={group}
                                />
                            </Modal>
                        </Paper>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
