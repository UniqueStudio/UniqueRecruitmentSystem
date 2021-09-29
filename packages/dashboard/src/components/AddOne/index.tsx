import AddIcon from '@mui/icons-material/Add';
import { Button, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useState } from 'react';

import { createRecruitment } from '@apis/rest';
import { Modal } from '@components/Modal';
import { Schedule } from '@components/Schedule';
import { Verify } from '@components/Verify';
import { Status } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/addOne';
import { convertRecruitmentName, roundToDay } from '@uniqs/utils';

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
    const { $component, $member } = useStores();
    const [{ modal, beginning, end, deadline, code }, setState] = useState(initialState());

    const disabled = !$member.isAdminOrCaptain;

    const handleLaunch = async () => {
        if (!code) {
            $component.enqueueSnackbar('请完整填写信息', Status.warning);
            return;
        }
        if (beginning >= deadline) {
            $component.enqueueSnackbar('截止时间必须大于开始时间', Status.warning);
            return;
        }
        if (deadline >= end) {
            $component.enqueueSnackbar('结束时间必须大于截止时间', Status.warning);
            return;
        }
        const ok = await createRecruitment({
            name: generateTitle(beginning),
            beginning: roundToDay(beginning).toJSON(),
            end: roundToDay(end).toJSON(),
            deadline: roundToDay(deadline).toJSON(),
            code,
        });
        if (ok) {
            setState(initialState());
        }
    };

    const handleChangeCode: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setState((prevState) => ({ ...prevState, code: value }));
    };

    const handleChangeDate = (name: 'beginning' | 'deadline' | 'end') => (date: unknown) => {
        if (date instanceof Date) {
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
                placement='top'
            >
                <Paper className={classes.paper}>
                    <IconButton
                        className={classes.newButton}
                        classes={{ root: classes.newButtonRoot }}
                        onClick={toggleModal}
                        disabled={disabled}
                    >
                        <AddIcon color='primary' className={classes.newIcon} />
                    </IconButton>
                </Paper>
            </Tooltip>
            <Modal title='发起招新' open={modal} onClose={toggleModal}>
                <div className={classes.newContainer}>
                    <Typography variant='h6'>{convertRecruitmentName(generateTitle(beginning))}</Typography>
                    <Schedule onChange={handleChangeDate} beginning={beginning} end={end} deadline={deadline} />
                    <Verify onChange={handleChangeCode} code={code} />
                    <Button className={classes.button} variant='contained' onClick={handleLaunch}>
                        确定
                    </Button>
                </div>
            </Modal>
        </>
    );
});
