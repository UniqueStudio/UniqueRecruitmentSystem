import { Button, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import { createRecruitment } from '@apis/rest';
import { Modal } from '@components/Modal';
import { Schedule } from '@components/Schedule';
import { Verify } from '@components/Verify';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/addOne';
import { roundToDay } from '@utils/time';
import { titleConverter } from '@utils/titleConverter';

const generateTitle = (date: Date) => {
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const type = month <= 5 ? 'S' : month >= 9 ? 'A' : 'C';
    return year + type;
};

const initialState = () => {
    const date = new Date();
    return {
        modal: false,
        beginning: date,
        end: date,
        deadline: date,
        code: '',
    };
};

export const AddOne: FC = observer(() => {
    const classes = useStyles();
    const { $component, $user } = useStores();
    const [{ modal, beginning, end, deadline, code }, setState] = useState(initialState());

    const disabled = !$user.isAdminOrCaptain;

    const handleLaunch = async () => {
        if (!code || !beginning || !end || !deadline) {
            $component.enqueueSnackbar('请完整填写信息', 'warning');
            return;
        }
        if (beginning >= deadline) {
            $component.enqueueSnackbar('截止时间必须大于开始时间', 'warning');
            return;
        }
        if (deadline >= end) {
            $component.enqueueSnackbar('结束时间必须大于截止时间', 'warning');
            return;
        }
        const ok = await createRecruitment({
            name: generateTitle(beginning),
            beginning: roundToDay(beginning),
            end: roundToDay(end),
            deadline: roundToDay(deadline),
            code,
        });
        if (ok) {
            setState(initialState());
        }
    };

    const handleChange = (name: string): ChangeEventHandler<HTMLInputElement> => ({ target: { value } }) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleChangeDate = (name: string) => (date: Date | null) => {
        if (date) {
            setState((prevState) => ({ ...prevState, [name]: date }));
        }
    };

    const toggleModal = () => {
        setState((prevState) => ({
            ...prevState,
            modal: !prevState.modal,
        }));
    };

    return (
        <>
            <Tooltip
                title={disabled ? '只有组长或管理员能发起招新' : '发起招新'}
                classes={{ tooltip: classes.tooltip }}
                placement='top'>
                <Paper className={classes.paper}>
                    <IconButton
                        className={classes.newButton}
                        classes={{ root: classes.newButtonRoot }}
                        onClick={toggleModal}
                        disabled={disabled}>
                        <AddIcon color='primary' className={classes.newIcon} />
                    </IconButton>
                </Paper>
            </Tooltip>
            <Modal title='发起招新' open={modal} onClose={toggleModal}>
                <div className={classes.newContainer}>
                    <Typography variant='h6'>{titleConverter(generateTitle(beginning))}</Typography>
                    <Schedule onChange={handleChangeDate} beginning={beginning} end={end} deadline={deadline} />
                    <Verify onChange={handleChange('code')} code={code} />
                    <Button className={classes.button} color='primary' variant='contained' onClick={handleLaunch}>
                        确定
                    </Button>
                </div>
            </Modal>
        </>
    );
});
