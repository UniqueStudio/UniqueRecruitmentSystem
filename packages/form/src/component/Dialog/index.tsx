import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogAction from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TransitionProps } from '@material-ui/core/transitions';
import Zoom from '@material-ui/core/Zoom';
import React from 'react';

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
            <DialogAction>
                {act.map((v: ActionButton) => {
                    return (
                        <Button key={v.name} onClick={v.handler} className={v.className} color='primary'>
                            {v.name}
                        </Button>
                    );
                })}
            </DialogAction>
        </Dialog>
    );
}
