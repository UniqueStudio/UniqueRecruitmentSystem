import React, { PureComponent } from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';

import IconButton from '@material-ui/core/IconButton';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Candidate from '../../container/Candidate/Candidate';
import Comments from '../../container/Candidate/CandidateComments';

import Modal from '../Modal/index';
import Detail from './CandidateDetail';

import styles from '../../style/column';

import { Candidate as CandidateType } from '../../lib/const';

interface Props extends WithStyles {
    candidate: CandidateType;
    index: number;
    step: number;
    disabled: boolean;
    modalOn: string;
    direction: 'left' | 'right' | 'up' | 'down';
    toggleModalOff: () => void;
    handlePrev: () => void;
    handleNext: () => void;
    downloadResume: (cid: string) => void;
}

class CandidateContainer extends PureComponent<Props> {

    render() {
        const { classes, toggleModalOff, step, modalOn, disabled, direction, handleNext, handlePrev, downloadResume, candidate, index } = this.props;
        return (
            <>
                <Draggable draggableId={candidate._id} index={index} isDragDisabled={disabled}>
                    {(dragProvided: DraggableProvided) => (
                        <Candidate step={step}
                                   cid={candidate._id}
                                   info={candidate}
                                   provided={dragProvided}
                        />
                    )}
                </Draggable>
                <Modal open={candidate._id === modalOn} onClose={toggleModalOff} direction={direction} title='详细信息'>
                    <div className={classes.detailContent}>
                        <IconButton className={classes.leftButton} onClick={handlePrev}>
                            <ExpandMoreIcon/>
                        </IconButton>
                        <div className={classes.detailMain}>
                            <Detail info={candidate} downloadResume={() => downloadResume(candidate._id)}/>
                            <Comments step={step} cid={candidate._id} comments={candidate.comments}/>
                        </div>
                        <IconButton className={classes.rightButton} onClick={handleNext}>
                            <ExpandMoreIcon/>
                        </IconButton>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withStyles(styles)(CandidateContainer);
