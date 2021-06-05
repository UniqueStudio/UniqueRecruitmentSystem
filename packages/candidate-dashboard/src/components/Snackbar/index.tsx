import { Snackbar, SnackbarCloseReason } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { MessageType } from 'config/types';
import { FC, useCallback, useEffect, useState } from 'react';

export interface SnackbarState {
    type: MessageType | undefined;
    message: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _key?: any;
}

export interface MySnackbarProps extends SnackbarState {
    onClose?: () => void;
}

const MySnackbar: FC<MySnackbarProps> = ({ type, message, _key, onClose }) => {
    const [open, setOpen] = useState(false);
    const [queue, setQueue] = useState<SnackbarState[]>([]);
    const [current, setCurrent] = useState<SnackbarState | null>(null);

    useEffect(() => {
        if (type && message) {
            setQueue((prev) => prev.concat([{ type, message, _key: _key ?? Date.now() }]));
        }
    }, [type, message, _key]);

    useEffect(() => {
        if (queue.length && open && current) {
            setOpen(false);
        } else if (queue.length && !current) {
            setCurrent({ ...queue[0] });
            setQueue((prev) => prev.slice(1));
            setOpen(true);
        }
    }, [open, current, queue]);

    const handleClose = useCallback(
        (_: unknown, reason?: SnackbarCloseReason) => {
            if (reason === 'clickaway') {
                return;
            }
            setOpen(false);
            onClose && onClose();
        },
        [onClose],
    );

    const handleExited = () => {
        setCurrent(null);
    };

    return (
        <Snackbar key={current?._key} open={open} autoHideDuration={3000} onClose={handleClose} onExited={handleExited}>
            <Alert onClose={handleClose} severity={current?.type} variant='filled'>
                {current?.message}
            </Alert>
        </Snackbar>
    );
};

export default MySnackbar;
export { MySnackbar };
