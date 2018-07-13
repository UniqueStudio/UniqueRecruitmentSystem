import * as React from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider, List,
    Paper,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";

import Candidate from "../container/Candidate";
import Modal from './Modal';
import Template from './Template/Template';

import styles from "../style";
import withRoot from "../style/withRoot";
import { DropTarget } from 'react-dnd';

interface Props extends WithStyles {
    title: string;
    candidates: object;
    group: string;
    selected: string[];
    select: (uid: string[]) => void;
    deselect: (uid: string[] | string) => void;
    remove: (step: string, uid: string[]) => void;
    move: (from: string, to: string, uid: string) => void;
    toggleOn: (info: string) => void;
    connectDropTarget: (content: any) => any;
    movingItem: object;
    dropped: boolean;
}

const titleToStep = (title: string) => `${['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程'].indexOf(title)}`;

let moveTo = '';

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
    length = Object.keys(this.props.candidates[titleToStep(this.props.title)]).length;

    state = {
        dialog: false,
        modal: false,
        removeConfirm: false,
        candidateModalOpen: new Array(this.length),
        direction: 'left'
    };

    CandidateElements = {};

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.group !== this.props.group) {
            this.setState({
                candidateModalOpen: new Array(this.length),
            });
        }
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
        const { select } = this.props;
        select(all);
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect } = this.props;
        deselect(selected);
        select(all.filter((i: string) => !selected.includes(i)));
    };

    confirmRemove = () => {
        this.toggleOpen('dialog')();
    };

    handleRemove = (selected: string[]) => () => {
        this.toggleOpen('dialog')();
        const { remove, title, toggleOn } = this.props;
        if (selected.length === 0) {
            toggleOn('你没有选中任何人');
            return;
        }
        remove(titleToStep(title), selected);
    };

    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name]
        });
    };

    render() {
        const { classes, title, candidates, group, selected, deselect, connectDropTarget, dropped, movingItem, move } = this.props;
        const step = titleToStep(title);
        const allCandidatesUids = Object.keys(candidates[step]);
        this.length = allCandidatesUids.length;
        const selectedCandidatesUids = selected.filter((i: string) => allCandidatesUids.includes(i));
        const selectedCandidatesInfo = selectedCandidatesUids.map((i: string) => {
            const current = candidates[step][i];
            return { uid: i, name: current.name, grade: current.grade, institute: current.institute };
        });

        if (dropped && moveTo === step) {
            move(movingItem['step'], moveTo, movingItem['uid']);
        }

        return (
            <Paper className={classes.column}>
                <div className={classes.columnHeader}>
                    <Typography variant='title' className={classes.columnTitle}>{title}</Typography>
                </div>
                <Divider />
                {connectDropTarget(<div className={classes.columnBody}>
                    <List>

                        {candidates[step] && Object.entries(candidates[step]).map((i, j) => (
                            <Candidate step={step}
                                       uid={i[0]}
                                       info={i[1]}
                                       key={i[0]}
                                       ref={c => this.CandidateElements[j] = c}
                                       onNext={this.handleNext(j)}
                                       onPrev={this.handlePrev(j)}
                                       modalOpen={Boolean(this.state.candidateModalOpen[j])}
                                       direction={this.state.direction}
                            />
                        ))}
                    </List>
                </div>)}
                <Divider />
                <div className={classes.columnBottom}>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleSelectAll(allCandidatesUids)}
                    >全选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleInverse(allCandidatesUids, selectedCandidatesUids)}
                    >反选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.toggleOpen('modal')}
                        disabled={selectedCandidatesUids.length === 0}
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
                        <Button onClick={this.handleRemove(selectedCandidatesUids)} color="primary">
                            确定移除
                        </Button>
                    </DialogActions>
                </Dialog>
                <Modal open={this.state.modal} onClose={this.toggleOpen('modal')} title='发送通知'>
                    <Template toggleOpen={this.toggleOpen('modal')}
                              selected={selectedCandidatesInfo}
                              deselect={deselect}
                              flowStep={step}
                              group={group}
                    />
                </Modal>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
