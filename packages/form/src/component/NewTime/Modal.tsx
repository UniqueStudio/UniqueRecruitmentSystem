import {
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    makeStyles,
    Theme,
} from '@material-ui/core';
import React, { useContext, useState } from 'react';

import { URL } from '../../config/const';
import translate from '../../config/translate';
import { SelectDate } from './date';
import { ToggleSnackbar } from './index';

interface StyleProps {
    color?: 'white' | undefined;
    fontColor?: string | undefined;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: (props: StyleProps) => ({
            color: props.color,
            fontWeight: 'bold',
            margin: theme.spacing(1),
            boxShadow: 'none',
        }),
    }),
);

interface ModalProps {
    clicked: (boolean | undefined)[];
    hash: string;
    step: '1' | '2' | string; // "1" for group and "2" for team
    dates: SelectDate[];
    onSubmitted: () => void;
}

export default (props: ModalProps): React.ReactElement => {
    const [open, setOpen] = useState(false);
    const [abandon, setAbandon] = useState(false);
    const { snackbar } = useContext(ToggleSnackbar);

    const white = useStyles({ color: 'white' });

    const handleClickOpen = (abandoned: boolean) => () => {
        setAbandon(abandoned);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const submitForm = async (abandoned: boolean, time: SelectDate[]) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                return snackbar('token不存在', 'warning');
            }
            const resp = await fetch(`${URL}/candidate/form/${props.hash}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    abandoned
                        ? { abandon: true }
                        : props.step === 'group'
                        ? { groupInterview: time }
                        : { teamInterview: time },
                ),
            });
            props.onSubmitted();
            const data = await resp.json();
            if (data.type !== 'success') {
                return snackbar(translate(data.message), data.type);
            }
            snackbar('提交成功，请等待短信通知！', 'success');
        } catch {
            snackbar('提交出了问题，请尝试重新提交', 'error');
        }
    };

    const handleSubmit = (abandoned: boolean) => async () => {
        const time = props.dates.map((i) => ({
            date: i.date,
            morning: 0,
            afternoon: 0,
            evening: 0,
        }));
        props.clicked.map((clicked, index) => {
            if (clicked) {
                const line = Math.floor(index / 3); // int
                const column = index - line * 3;
                time[line][['morning', 'afternoon', 'evening'][column]] = 1;
            }
        });
        await submitForm(abandoned, time);

        setOpen(false);
    };

    const disabled = !props.clicked.includes(true);

    return (
        <div>
            <div>
                <Button
                    variant='contained'
                    color='primary'
                    disabled={disabled ? true : undefined}
                    onClick={disabled ? undefined : handleClickOpen(false)}
                    className={white.button}
                    disableRipple
                >
                    提交
                </Button>
                <Button variant='contained' color='secondary' onClick={handleClickOpen(true)} className={white.button}>
                    放弃面试
                </Button>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>{'请确认你的选择'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        {abandon
                            ? '如果你以上时间都无法到场，可以尝试联系我们调整时间，或选择放弃面试同时错过本次招新'
                            : '请务必保证面试可以到场，你的选择将无法更改'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSubmit(abandon)}
                        color='primary'
                        variant='contained'
                        className={white.button}
                    >
                        我确认
                    </Button>
                    <Button
                        onClick={handleClose}
                        color='secondary'
                        autoFocus
                        variant='contained'
                        className={white.button}
                    >
                        再想想
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
