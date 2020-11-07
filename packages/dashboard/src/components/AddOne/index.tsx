import React, { ChangeEventHandler, FC, memo, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

import Modal from '../Modal';
import Schedule from '../Schedule';

import { Props } from '../../containers/AddOne';
import Verify from '../../containers/Verify';

import useStyles from '../../styles/addOne';

import { getMidnight } from '../../utils/getMidnight';
import { titleConverter } from '../../utils/titleConverter';

const titles = ['S', 'C', 'A', 'O'].map((i) => `${new Date().getFullYear()}${i}`);

const initialState = () => {
    const now = new Date();
    return {
        modal: false,
        title: `${now.getFullYear()}O`,
        begin: now,
        end: now,
        stop: now,
        code: '',
    };
};

const AddOne: FC<Props> = memo(({ disabled, enqueueSnackbar, launchRecruitment, shouldClear }) => {
    const classes = useStyles();
    const [{ modal, title, begin, end, stop, code }, setState] = useState(initialState());

    useEffect(() => {
        if (shouldClear) {
            setState(initialState());
        }
    }, [shouldClear]);

    const handleLaunch = () => {
        if (!code || !begin || !end || !stop || !title) {
            enqueueSnackbar('请完整填写信息！', { variant: 'warning' });
            return;
        }
        if (begin >= stop) {
            enqueueSnackbar('截止时间必须大于开始时间！', { variant: 'warning' });
            return;
        }
        if (stop >= end) {
            enqueueSnackbar('结束时间必须大于截止时间！', { variant: 'warning' });
            return;
        }
        launchRecruitment({
            title,
            begin: getMidnight(begin),
            end: getMidnight(end),
            stop: getMidnight(stop),
            code,
        });
    };

    const handleChange = (name: string): ChangeEventHandler<HTMLInputElement> => ({ target: { value } }) => {
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeDate = (name: string) => (date: Date | null) => {
        if (date) {
            setState((prevState) => ({
                ...prevState,
                [name]: date,
            }));
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
                    <TextField
                        label='招新名称'
                        select
                        onChange={handleChange('title')}
                        className={classes.textField}
                        value={title}
                        margin='normal'>
                        {titles.map((option) => (
                            <MenuItem key={option} value={option}>
                                {titleConverter(option)}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Schedule
                        onChange={handleChangeDate}
                        begin={begin}
                        end={end}
                        stop={stop}
                        className={classes.datePicker}
                    />
                    <Verify onChange={handleChange('code')} code={code} />
                    <Button color='primary' variant='contained' onClick={handleLaunch}>
                        确定
                    </Button>
                </div>
            </Modal>
        </>
    );
});

export default AddOne;
