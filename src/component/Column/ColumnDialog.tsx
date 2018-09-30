import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
    onClick: () => void;
}

class ColumnDialog extends PureComponent<Props> {

    render() {
        const { open, toggleOpen, onClick } = this.props;
        return (
            <Dialog
                open={open}
                onClose={toggleOpen}
            >
                <DialogTitle>提醒</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        这将永远移除该候选人，你确定吗？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen} color='primary' autoFocus>
                        否
                    </Button>
                    <Button onClick={onClick} color='primary'>
                        确定移除
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withRoot(withStyles({})(ColumnDialog));
