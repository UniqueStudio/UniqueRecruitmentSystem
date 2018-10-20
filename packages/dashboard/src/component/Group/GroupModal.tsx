import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/group';

import Modal from '../Modal';

import { Recruitment, Time } from '../../lib/const';

interface Props extends WithStyles {
    userGroup: string;
    currentRecruitment: Recruitment;
    interviewStage: number;
    counts: number[][];
    modalOpen: boolean;
    handleSelect: (i: number, j: number) => (event: React.ChangeEvent) => void;
    submitAllocation: () => void;
    toggleModal: () => void;
}

class GroupModal extends PureComponent<Props> {

    render() {
        const { classes, currentRecruitment, userGroup, toggleModal, interviewStage, counts, modalOpen, handleSelect, submitAllocation } = this.props;
        const { time1, time2 } = currentRecruitment;
        const translator = { morning: '上午', afternoon: '下午', evening: '晚上' };
        return (
            <Modal title='选定人数' open={modalOpen} onClose={toggleModal}>
                <div className={classes.chooseContainer}>
                    {(interviewStage === 1 ? time1[userGroup] : time2).map((i: Time, j: number) =>
                        <div key={j} className={classes.choose}>
                            <Chip color='primary' label={i.date} className={classes.chip}/>
                            {Object.entries(i).filter((ii) => ii[0] !== 'date').map(
                                (k, l) => <TextField
                                    label={translator[k[0]]}
                                    key={l}
                                    value={Math.max(counts[j][l], 0)}
                                    onChange={handleSelect(j, l)}
                                    className={classes.textField}
                                    type='number'
                                    InputLabelProps={{ shrink: true }}
                                    margin='normal'
                                    disabled={!k[1]}
                                />)}
                        </div>,
                    )}
                    <Typography variant='caption' className={classes.notification}>
                        为了使自动分配更加高效，你可以尝试在能够接受的范围内给各时间段分配更多人数
                    </Typography>
                    <div className={classes.buttonContainer}>
                        <Button
                            color='primary'
                            variant='contained'
                            className={classes.button}
                            onClick={submitAllocation}
                        >开始分配</Button>
                        <Button
                            color='primary'
                            className={classes.button}
                            onClick={toggleModal}
                        >取消分配</Button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default withStyles(styles)(GroupModal);
