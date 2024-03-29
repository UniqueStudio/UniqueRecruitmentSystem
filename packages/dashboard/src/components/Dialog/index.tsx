import {
    Button,
    Dialog as MuiDialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
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

export const Dialog: FC<Props> = memo(({ open, toggleOpen, onClick, content, title, yes = '是', no = '否' }) => (
    <MuiDialog open={open} onClose={toggleOpen}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={toggleOpen} autoFocus>
                {no}
            </Button>
            <Button onClick={onClick}>{yes}</Button>
        </DialogActions>
    </MuiDialog>
));
