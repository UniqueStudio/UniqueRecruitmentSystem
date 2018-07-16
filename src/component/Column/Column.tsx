import * as React from "react";
import { Dispatch } from 'redux';
import { DropTarget } from 'react-dnd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import Candidate from "../../container/Candidate/Candidate";
import Modal from '../Modal';
import Template from '../Template';
import { STEP } from '../../lib/const';
import styles from "../../style/index";
import withRoot from "../../style/withRoot";
import { removeCandidate } from '../../action/async';

interface Props extends WithStyles {
    title: string;
    candidates: object;
    group: string;
    isLoading: boolean;
    selected: string[];
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    dispatch: Dispatch<any>;
    move: (from: number, to: number, cid: string) => void;
    toggleOn: (info: string) => void;
    connectDropTarget: (content: any) => any;
    movingItem: object;
    dropped: boolean;
}

const titleToStep = (title: string) => STEP.indexOf(title);

let moveTo = NaN;

@DropTarget('candidate', {
    drop(props: Props) {
        moveTo = titleToStep(props.title);
    }
}, (connect, monitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        movingItem: monitor.getItem(),
        dropped: monitor.didDrop(),
    }
})
class Column extends React.Component<Props> {
    length = Object.keys(this.props.candidates).length;

    state = {
        dialog: false,
        modal: false,
        removeConfirm: false,
        candidateModalOpen: new Array(this.length),
        direction: 'left'
    };

    CandidateElements = {};

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            candidateModalOpen: new Array(this.length),
        });
    }

    handleNext = (i: number) => () => {
        const list: any[] = new Array(this.length);
        list[i + 1] = true;
        this.setState({
            candidateModalOpen: list,
            direction: 'left'
        });
    };

    handlePrev = (i: number) => () => {
        const list: any[] = new Array(this.length);
        list[i - 1] = true;
        this.setState({
            candidateModalOpen: list,
            direction: 'right'
        });
    };

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

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { toggleOn } = this.props;
        if (selected.length === 0) {
            toggleOn('你没有选中任何人');
            return;
        }
        selected.map(i => this.props.dispatch(removeCandidate(i)));
    };

    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name]
        });
    };

    render() {
        const { classes, title, candidates, group, selected, deselect, connectDropTarget, dropped, movingItem, move } = this.props;
        const allCandidatesCids = Object.keys(candidates);
        this.length = allCandidatesCids.length;
        const selectedCandidatesCids = selected.filter((i: string) => allCandidatesCids.includes(i));
        const selectedCandidatesInfo = selectedCandidatesCids.map((i: string) => {
            const current = candidates[i];
            return { cid: i, ...current };
        });

        if (dropped && moveTo === titleToStep(title)) {
            move(movingItem['step'], moveTo, movingItem['cid']);
        }

        return (
            <Paper className={classes.column}>
                <div className={classes.columnHeader}>
                    <Typography variant='title' className={classes.columnTitle}>{title}</Typography>
                </div>
                <Divider />
                {connectDropTarget(<div className={classes.columnBody}>
                    {candidates && Object.entries(candidates).map((i, j) => (
                        <Candidate step={titleToStep(title)}
                                   cid={i[0]}
                                   info={i[1]}
                                   key={i[0]}
                                   ref={c => this.CandidateElements[j] = c}
                                   onNext={this.handleNext(j)}
                                   onPrev={this.handlePrev(j)}
                                   modalOpen={Boolean(this.state.candidateModalOpen[j])}
                                   direction={this.state.direction}
                        />
                    ))}
                </div>)}
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
        );
    }
}

export default withRoot(withStyles(styles)(Column));
