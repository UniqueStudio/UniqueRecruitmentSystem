import React, { PureComponent } from "react";
import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import AddIcon from '@material-ui/icons/Add';
import { Candidate as CType } from '../../lib/const';
import styles from "../../style/column";
import withRoot from "../../style/withRoot";
import classNames from "classnames";

interface Props extends WithStyles {
    candidates: Map<string, CType>;
    selected: string[];
    fabOn: number;
    canOperate: boolean;
    snackbarOn: boolean;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    toggleFabOff: () => void;
    toggleOpen: (component: string) => () => void;
}

class Fab extends PureComponent<Props> {

    state = {
        buttons: false,
    };

    toggleButtons = () => {
        this.setState({
            buttons: !this.state.buttons
        })
    };

    handleSelectAll = (all: string[]) => () => {
        const { select, candidates } = this.props;
        select(all.filter(i => !(candidates.get(i)!.abandon || candidates.get(i)!.rejected)));
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect, candidates } = this.props;
        deselect(selected.filter(i => !(candidates.get(i)!.abandon || candidates.get(i)!.rejected)));
        select(all.filter((i: string) => !selected.includes(i) && !(candidates.get(i)!.abandon || candidates.get(i)!.rejected)));
    };

    hideFab = () => {
        const { deselect, selected } = this.props;
        this.toggleButtons();
        deselect(selected);
    };
    sendNotification = () => {
        this.props.toggleOpen('modal')();
        this.toggleButtons();
    };
    confirmRemove = () => {
        this.props.toggleOpen('dialog')();
        this.toggleButtons();
    };

    static getDerivedStateFromProps(nextProps: Props) {
        if (nextProps.selected.length === 0) {
            nextProps.toggleFabOff();
            return {
                buttons: false,
            }
        }
        return null;
    }

    render() {
        const { classes, candidates, selected, fabOn, snackbarOn, canOperate } = this.props;
        const allCandidatesCids = [...candidates.keys()];
        const selectedCandidatesCids = selected.filter((i: string) => allCandidatesCids.includes(i));

        return (
            <>
                <Zoom in={fabOn !== -1}>
                    <div className={classes.fab}>
                        <Button variant="fab"
                                className={snackbarOn ? classes.fabMoveUp : classes.fabMoveDown}
                                color='primary' onClick={this.toggleButtons}>
                            <AddIcon />
                        </Button>
                    </div>
                </Zoom>
                <Zoom in={this.state.buttons}>
                    <div className={classes.fabButtonsZoom}>
                        <div
                            className={classNames(classes.fabButtonsContainer, snackbarOn ? classes.fabMoveUp : classes.fabMoveDown)}>
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
                                onClick={this.sendNotification}
                                disabled={selectedCandidatesCids.length === 0 || !canOperate}
                            >发送通知</Button>
                            <Button
                                color='primary'
                                size='small'
                                variant='contained'
                                className={classes.fabButton}
                                onClick={this.confirmRemove}
                                disabled={!canOperate}
                            >移除</Button>
                            <Button
                                color='primary'
                                size='small'
                                variant='contained'
                                className={classes.fabButton}
                                onClick={this.hideFab}
                            >隐藏</Button>
                        </div>
                    </div>
                </Zoom>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Fab));
