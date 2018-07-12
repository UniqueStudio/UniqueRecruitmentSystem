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
import Template from './Template';

import styles from "../style";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    title: string;
    candidates: object;
    selected: string[];
    select: (name: string[]) => void;
    deselect: (name: string[]) => void;
    remove: (step: string, name: string[]) => void;
    toggleOn: (info: string) => void;
}

const titleToStep = (title: string) => `${['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程'].indexOf(title)}`;

class Column extends React.Component<Props> {

    state = {
        dialog: false,
        modal: false,
        removeConfirm: false,
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
        const { classes, title, candidates, selected } = this.props;
        const step = titleToStep(title);
        const allCandidates = Object.keys(candidates[titleToStep(title)]);
        const selectedCandidates = selected.filter((i: string) => allCandidates.includes(i));

        return (
            <Paper className={classes.column}>
                <div className={classes.columnHeader}>
                    <Typography variant='title' className={classes.columnTitle}>{title}</Typography>
                </div>
                <Divider />
                <List className={classes.columnBody}>
                    {candidates[step] && Object.entries(candidates[step]).map(i => (
                        <Candidate step={step}
                                   name={i[0]}
                                   grade={i[1]['grade']}
                                   institute={i[1]['institute']}
                                   comments={i[1]['comments']}
                                   key={i[0]}
                        />
                    ))}
                </List>
                <Divider />
                <div className={classes.columnBottom}>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleSelectAll(allCandidates)}
                    >全选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleInverse(allCandidates, selectedCandidates)}
                    >反选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.toggleOpen('modal')}
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
                        <Button onClick={this.handleRemove(selectedCandidates)} color="primary">
                            确定移除
                        </Button>
                    </DialogActions>
                </Dialog>
                <Modal open={this.state.modal} onClose={this.toggleOpen('modal')} title='发送通知'>
                    <Template toggleOpen={this.toggleOpen('modal')} selected={selectedCandidates} flow={step}/>
                </Modal>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
