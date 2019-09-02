import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import Zoom from '@material-ui/core/Zoom';

interface ActionButton {
    name: string;
    handler: () => void;
    className?: string;
}

interface Props {
    open: boolean;
    content: string | JSX.Element;
    title: string | JSX.Element;
    action?: ActionButton[];
}

const Transition = React.forwardRef<unknown, TransitionProps>((props, ref) => {
    return <Zoom ref={ref} {...props} />;
});

export default function MyDialog(props: Props) {
    const { open, title, content, action } = props;
    const act: ActionButton[] = action ? (action as ActionButton[]) : ([] as ActionButton[]);
    return (
        <Dialog open={open} TransitionComponent={Transition}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {act.map((v: ActionButton) => {
                    return (
                        <Button key={v.name} onClick={v.handler} className={v.className} color='primary'>
                            {v.name}
                        </Button>
                    );
                })}
            </DialogActions>
        </Dialog>
    );
}
