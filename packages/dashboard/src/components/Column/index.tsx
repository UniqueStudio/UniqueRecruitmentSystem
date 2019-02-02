import React, { PureComponent } from 'react';
import { Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { STEPS } from '../../config/consts';
import { Candidate as CandidateType, Step } from '../../config/types';
import Candidate from '../../containers/Candidate';
import styles from '../../styles/column';

interface Props extends WithStyles {
    step: Step;
    dropIndex: number;
    isTeamInterview: boolean;
    candidates: CandidateType[];
    selected: string[];
    toggleDetail: (index: number) => () => void;
}

class Column extends PureComponent<Props> {

    render() {
        const { classes, step, candidates, selected, dropIndex, isTeamInterview, toggleDetail } = this.props;
        const selectedCid = selected.filter((cid) => candidates.find(({ _id }) => cid === _id));
        const DropArea = (
            <Droppable droppableId={STEPS[step]} type='CANDIDATE'>
                {({ innerRef, droppableProps, placeholder }) => (
                    <div className={classes.columnBody} ref={(element) => innerRef(element)} {...droppableProps}>
                        {candidates.map((candidate, index) => (
                            <Draggable
                                draggableId={candidate._id}
                                key={candidate._id}
                                index={index}
                                isDragDisabled={candidate.abandon || candidate.rejected || selectedCid.includes(candidate._id)}
                            >
                                {(dragProvided: DraggableProvided) => (
                                    <Candidate
                                        candidate={candidate}
                                        provided={dragProvided}
                                        selected={selected}
                                        isTeamInterview={isTeamInterview}
                                        toggleDetail={toggleDetail(index)}
                                    />
                                )}
                            </Draggable>
                        ))}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        );

        return (
            <Draggable draggableId={STEPS[step]} index={dropIndex}>
                {({ innerRef, dragHandleProps, draggableProps }) => (
                    <div ref={innerRef} {...draggableProps}>
                        <Paper className={classes.column}>
                            <div className={classes.columnHeader}>
                                <Typography variant='h6' className={classes.columnTitle} {...dragHandleProps}>{STEPS[step]}</Typography>
                            </div>
                            <Divider />
                            {DropArea}
                        </Paper>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default withStyles(styles)(Column);
