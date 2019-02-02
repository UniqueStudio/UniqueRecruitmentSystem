import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import AddIcon from '@material-ui/icons/Add';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../styles/column';

import { Candidate } from '../../config/types';

interface Props extends WithStyles {
    candidates: Candidate[];
    selected: string[];
    fabOn: number;
    canOperate: boolean;
    select: (cid: string[]) => void;
    deselect: (cid: string[] | string) => void;
    toggleFabOff: () => void;
    toggleOpen: (component: string) => () => void;
}

class FabButton extends PureComponent<Props> {

    state = {
        buttons: false,
    };

    componentDidUpdate(prevProps: Props) {
        const { selected, toggleFabOff } = this.props;
        if (prevProps.selected.length !== 0 && selected.length === 0) {
            toggleFabOff();
            this.setState({
                buttons: false
            });
        }
    }

    handleSelectAll = (all: string[]) => () => {
        const { select, candidates } = this.props;
        select(all.filter((cid) => this.selectable(candidates, cid)));
    };

    handleInverse = (all: string[], selected: string[]) => () => {
        const { select, deselect, candidates } = this.props;
        deselect(selected.filter((cid) => this.selectable(candidates, cid)));
        select(all.filter((cid) => !selected.includes(cid) && this.selectable(candidates, cid)));
    };

    selectable = (candidates: Candidate[], cid: string) => {
        const candidate = candidates.find(({ _id }) => _id === cid);
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
        this.setState(({ buttons }: { buttons: boolean }) => ({
            buttons: !buttons,
        }));
    };

    render() {
        const { classes, candidates, selected, fabOn, canOperate } = this.props;
        const all = candidates.map(({ _id }) => _id);
        const selectedInColumn = selected.filter((cid) => all.includes(cid));
        const ButtonGenerator = (onClick: () => void, content: string, disabled: boolean = false) =>
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
                        <Fab
                            className={true ? classes.fabMoveUp : classes.fabMoveDown} // TODO: fab move up when snackbar on
                            color='primary'
                            onClick={this.toggleButtons}
                        >
                            <AddIcon />
                        </Fab>
                    </div>
                </Zoom>
                <Zoom in={this.state.buttons}>
                    <div className={classes.fabButtonsZoom}>
                        <div
                            className={classNames(classes.fabButtonsContainer, true ? classes.fabMoveUp : classes.fabMoveDown)}>
                            {ButtonGenerator(this.handleSelectAll(all), '全选')}
                            {ButtonGenerator(this.handleInverse(all, selectedInColumn), '反选')}
                            {ButtonGenerator(this.sendNotification, '发送通知', !selectedInColumn.length || !canOperate)}
                            {ButtonGenerator(this.confirmRemove, '移除', !selectedInColumn.length || !canOperate)}
                            {ButtonGenerator(this.hideFab, '隐藏Fab')}
                        </div>
                    </div>
                </Zoom>
            </>
        );
    }
}

export default withStyles(styles)(FabButton);
