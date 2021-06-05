import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Zoom from '@material-ui/core/Zoom';
import React, { memo } from 'react';

interface ActionButton {
    name: string;
    handler: () => void;
    className?: string;
}

interface DialogProps {
    open: boolean;
    content: string | JSX.Element;
    title: string | JSX.Element;
    action?: ActionButton[];
}

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
    // @ts-ignore
    return <Zoom ref={ref} {...props} />;
});

export default memo((props: DialogProps) => {
    const { open, title, content, action = [] } = props;
    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {action.map((v: ActionButton) => {
                    return (
                        <Button key={v.name} onClick={v.handler} className={v.className} color='primary'>
                            {v.name}
                        </Button>
                    );
                })}
            </DialogActions>
        </Dialog>
    );
});
