import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Zoom from '@material-ui/core/Zoom';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import AddIcon from '@material-ui/icons/Add';

import { Candidate as CandidateType } from '../../lib/const';

import styles from '../../style/column';

interface Props extends WithStyles {
    candidates: Map<string, CandidateType>;
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

    static getDerivedStateFromProps(nextProps: Props) {
        if (nextProps.selected.length === 0) {
            nextProps.toggleFabOff();
            return {
                buttons: false,
            };
        }
        return null;
    }

    state = {
        buttons: false,
    };

    handleSelectAll = (all: string[]) => () => {
        const { select, candidates } = this.props;
        select(all.filter((cid) => this.selectable(candidates, cid)));
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect, candidates } = this.props;
        deselect(selected.filter((cid) => this.selectable(candidates, cid)));
        select(all.filter((cid) => !selected.includes(cid) && this.selectable(candidates, cid)));
    };

    selectable = (candidates: Map<string, CandidateType>, cid: string) => {
        const candidate = candidates.get(cid);
        return candidate && !(candidate.abandon || candidate.rejected);
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

    toggleButtons = () => {
        this.setState({
            buttons: !this.state.buttons,
        });
    };

    render() {
        const { classes, candidates, selected, fabOn, snackbarOn, canOperate } = this.props;
        const allCandidatesCids = [...candidates.keys()];
        const selectedCandidatesCids = selected.filter((cid) => allCandidatesCids.includes(cid));
        const FabButton = (onClick: () => void, content: string, disabled: boolean = false) =>
            <Button
                color='primary'
                size='small'
                variant='contained'
                className={classes.fabButton}
                onClick={onClick}
                disabled={disabled}
            >{content}</Button>;
        return (
            <>
                <Zoom in={fabOn !== -1}>
                    <div className={classes.fab}>
                        <Button
                            variant='fab'
                            className={snackbarOn ? classes.fabMoveUp : classes.fabMoveDown}
                            color='primary'
                            onClick={this.toggleButtons}
                        >
                            <AddIcon />
                        </Button>
                    </div>
                </Zoom>
                <Zoom in={this.state.buttons}>
                    <div className={classes.fabButtonsZoom}>
                        <div
                            className={classNames(classes.fabButtonsContainer, snackbarOn ? classes.fabMoveUp : classes.fabMoveDown)}>
                            {FabButton(this.handleSelectAll(allCandidatesCids), '全选')}
                            {FabButton(this.handleInverse(allCandidatesCids, selectedCandidatesCids), '反选')}
                            {FabButton(this.sendNotification, '发送通知', !(selectedCandidatesCids.length && canOperate))}
                            {FabButton(this.confirmRemove, '移除', !canOperate)}
                            {FabButton(this.hideFab, '隐藏')}
                        </div>
                    </div>
                </Zoom>
            </>
        );
    }
}

export default withStyles(styles)(Fab);
