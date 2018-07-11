import * as React from "react";
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Paper,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import styles from "../style/style";
import Candidate from "../container/Candidate";
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

const titleToStep = {
    '报名流程': '0',
    '笔试流程': '1',
    '面试流程': '2',
    '熬测流程': '3',
    '群面流程': '4',
};

class Column extends React.Component<Props> {

    state = {
        modalOpen: false,
        removeConfirm: false,
    };

    handleSelectAll = () => {
        const { candidates, title, select } = this.props;
        select(Object.keys(candidates[titleToStep[title]]));
    };

    handleInverse = () => {
        const { candidates, selected, title, select, deselect } = this.props;
        const allCandidates = Object.keys(candidates[titleToStep[title]]);
        const selectedCandidates = selected.filter((i: string) => allCandidates.includes(i));
        deselect(selectedCandidates);
        select(allCandidates.filter((i: string) => !selectedCandidates.includes(i)));
    };

    confirmRemove = () => {
        this.toggleModalOpen();
    };

    handleRemove = () => {
        this.toggleModalOpen();
        const { remove, title, candidates, selected, toggleOn } = this.props;
        const allCandidates = Object.keys(candidates[titleToStep[title]]);
        const selectedCandidates = selected.filter((i: string) => allCandidates.includes(i));
        if (selectedCandidates.length === 0) {
            toggleOn('你没有选中任何人');
            return;
        }
        remove(titleToStep[title], selectedCandidates);
    };

    toggleModalOpen = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        });
    };

    render() {
        const { classes, title, candidates } = this.props;
        return (
            <Paper className={classes.column}>
                <div className={classes.columnHeader}>
                    <Typography variant='title' className={classes.columnTitle}>{title}</Typography>
                </div>
                <div className={classes.columnBody}>
                    <Divider />
                    {Object.entries(candidates[titleToStep[title]]).map(i => (
                        <Candidate step={titleToStep[title]}
                                   name={i[0]}
                                   grade={i[1]['grade']}
                                   institute={i[1]['institute']}
                                   comments={i[1]['comments']}
                                   key={i[0]}
                        />
                    ))}
                </div>
                <Divider />
                <div className={classes.columnBottom}>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleSelectAll}
                    >全选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
                        onClick={this.handleInverse}
                    >反选</Button>
                    <Button
                        color='primary'
                        size='small'
                        className={classes.columnButton}
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
                    open={this.state.modalOpen}
                    onClose={this.toggleModalOpen}
                >
                    <DialogTitle>提醒</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            这将永远移除该候选人，你确定吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggleModalOpen} color="primary" autoFocus>
                            否
                        </Button>
                        <Button onClick={this.handleRemove} color="primary">
                            确定移除
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
