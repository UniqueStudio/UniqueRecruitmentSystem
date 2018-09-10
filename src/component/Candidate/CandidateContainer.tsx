import React, { PureComponent } from "react";
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from '@material-ui/core/IconButton';
import Detail from './CandidateDetail';
import Comments from '../../container/Candidate/CandidateComments';
import Candidate from "../../container/Candidate/Candidate";
import Modal from '../Modal/index';
import { Candidate as CType } from '../../lib/const';
import styles from "../../style/column";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    i: [string, CType],
    j: number,
    step: number;
    disabled: boolean;
    modalOn: string;
    direction: "left" | "right" | "up" | "down";
    toggleModalOff: () => void;
    handlePrev: () => void;
    handleNext: () => void;
    downloadResume: (cid: string) => void;
}


class CandidateContainer extends PureComponent<Props> {

    render() {
        const { i, j, classes, toggleModalOff, step, modalOn, disabled, direction, handleNext, handlePrev, downloadResume } = this.props;
        return (
            <>
                <Draggable draggableId={i[0]} index={j} isDragDisabled={disabled}>
                    {(dragProvided: DraggableProvided) => (
                        <Candidate step={step}
                                   cid={i[0]}
                                   info={i[1]}
                                   provided={dragProvided}
                        />
                    )}
                </Draggable>
                <Modal open={i[0] === modalOn} onClose={toggleModalOff} direction={direction} title='详细信息'>
                    <div className={classes.detailContent}>
                        <IconButton className={classes.leftButton} onClick={handlePrev}>
                            <ExpandMoreIcon />
                        </IconButton>
                        <div className={classes.detailMain}>
                            <Detail info={i[1]} downloadResume={() => downloadResume(i[0])} />
                            <Comments step={step} cid={i[0]} comments={i[1].comments} />
                        </div>
                        <IconButton className={classes.rightButton} onClick={handleNext}>
                            <ExpandMoreIcon />
                        </IconButton>
                    </div>
                </Modal>
            </>
        );
    }
}

export default withRoot(withStyles(styles)(CandidateContainer));
