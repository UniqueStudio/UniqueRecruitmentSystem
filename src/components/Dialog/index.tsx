import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
    open: boolean;
    title: string;
    content: string;
    yes?: string;
    no?: string;
    toggleOpen: () => void;
    onClick: () => void;
}

class CustomDialog extends PureComponent<Props> {

    render() {
        const { open, toggleOpen, onClick, content, title, yes = '是', no = '否' } = this.props;
        return (
            <Dialog open={open} onClose={toggleOpen}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={toggleOpen} color='primary' autoFocus>{no}</Button>
                    <Button onClick={onClick} color='primary'>{yes}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CustomDialog;
