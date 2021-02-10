import { Snackbar, SnackbarCloseReason } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { MessageType } from 'config/types';
import { FC, useEffect, useState } from 'react';

export interface MySnackbarProps {
  type: MessageType | undefined;
  message: string | undefined;
}

const MySnackbar: FC<MySnackbarProps> = ({ type, message }) => {
  const [open, setOpen] = useState(false);
  const [queue, setQueue] = useState<MySnackbarProps[]>([]);
  const [current, setCurrent] = useState<MySnackbarProps | null>(null);

  useEffect(() => {
    if (type && message) {
      setQueue((prev) => prev.concat([{ type, message }]));
    }
  }, [type, message]);

  useEffect(() => {
    if (queue.length && open && current) {
      setOpen(false);
    } else if (queue.length && !current) {
      setCurrent({ ...queue[0] });
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    }
  }, [open, current, queue]);

  const handleClose = (_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setCurrent(null);
  };

  return (
    <Snackbar key={current?.message} open={open} autoHideDuration={3000} onClose={handleClose} onExited={handleExited}>
      <Alert onClose={handleClose} severity={current?.type} variant='filled'>
        {current?.message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
export { MySnackbar };
