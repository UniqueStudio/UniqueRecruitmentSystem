import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';

import { launchRecruitment } from '../../apis/rest';
import Verify from '../../components/Verify';
import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/addOne';
import { getMidnight } from '../../utils/getMidnight';
import { titleConverter } from '../../utils/titleConverter';
import Modal from '../Modal';
import Schedule from '../Schedule';

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
        title: generateTitle(date),
        begin: date,
        end: date,
        stop: date,
        code: '',
    };
};

interface Props {
    shouldClear: boolean;
}

const AddOne: FC<Props> = observer(({ shouldClear }) => {
    const classes = useStyles();
    const { $component, $user } = useStores();
    const [{ modal, title, begin, end, stop, code }, setState] = useState(initialState());

    const disabled = !$user.isAdminOrCaptain;

    useEffect(() => {
        if (shouldClear) {
            setState(initialState());
        }
    }, [shouldClear]);

    const handleLaunch = async () => {
        if (!code || !begin || !end || !stop || !title) {
            $component.enqueueSnackbar('请完整填写信息！', 'warning');
            return;
        }
        if (begin >= stop) {
            $component.enqueueSnackbar('截止时间必须大于开始时间！', 'warning');
            return;
        }
        if (stop >= end) {
            $component.enqueueSnackbar('结束时间必须大于截止时间！', 'warning');
            return;
        }
        await launchRecruitment({
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
                title: name === 'begin' ? generateTitle(date) : prevState.title,
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
                        className={classes.textField}
                        value={titleConverter(title)}
                        margin='normal'
                        disabled
                    />
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
