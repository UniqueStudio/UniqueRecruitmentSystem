import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { FC, memo } from 'react';

interface Props {
    open: boolean;
    title: string;
    content: string;
    yes?: string;
    no?: string;
    toggleOpen: () => void;
    onClick: () => void;
}

const CustomDialog: FC<Props> = memo(({ open, toggleOpen, onClick, content, title, yes = '是', no = '否' }) => (
    <Dialog open={open} onClose={toggleOpen}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={toggleOpen} color='primary' autoFocus>
                {no}
            </Button>
            <Button onClick={onClick} color='primary'>
                {yes}
            </Button>
        </DialogActions>
    </Dialog>
));

export default CustomDialog;
