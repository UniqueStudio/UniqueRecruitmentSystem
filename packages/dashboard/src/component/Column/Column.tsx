import React, { Component } from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Candidate, STEPS } from '../../lib/const';

import styles from '../../style/column';

import CandidateContainer from '../Candidate/CandidateContainer';

interface Props extends WithStyles {
    title: string;
    dropIndex: number;
    isDragging: boolean;
    cidList: string[];
    infoList: Candidate[];
    selected: string[];
    modalOn: string;
    toggleModalOn: (cid: string) => void;
    toggleModalOff: () => void;
    changeInputting: (comment: string, evaluation: string) => void;
    downloadResume: (cid: string) => void;
}

const titleToStep = (title: string) => STEPS.indexOf(title);

class Column extends Component<Props> {

    state = {
        direction: 'left' as 'left',
    };

    handleNext = (cid: string) => () => {
        this.props.toggleModalOn(cid);
        this.props.changeInputting('', '');
        this.setState({
            direction: 'left',
        });
    };

    handlePrev = (cid: string) => () => {
        this.props.toggleModalOn(cid);
        this.props.changeInputting('', '');
        this.setState({
            direction: 'right',
        });
    };

    toggleOpen = (name: string) => () => {
        this.setState({
            [name]: !this.state[name],
        });
    };

    shouldComponentUpdate() {
        return !this.props.isDragging;
    }

    render() {
        const { classes, title, cidList, infoList, selected, modalOn, toggleModalOff, dropIndex, downloadResume } = this.props;
        const selectedCid = selected.filter((cid) => cidList.includes(cid));
        const DropArea = (
            <Droppable droppableId={title} type='CANDIDATE'>
                {({ innerRef, droppableProps, placeholder }: DroppableProvided) => (
                    <div className={classes.columnBody}
                         ref={(element) => innerRef(element)}
                         {...droppableProps}
                    >
                        {infoList.map((candidate: Candidate, index: number) => (
                            <CandidateContainer
                                candidate={candidate}
                                index={index}
                                key={index}
                                disabled={candidate.abandon || candidate.rejected || selectedCid.includes(candidate._id)}
                                toggleModalOff={toggleModalOff}
                                modalOn={modalOn}
                                step={titleToStep(title)}
                                direction={this.state.direction}
                                handlePrev={this.handlePrev(cidList[index - 1])}
                                handleNext={this.handleNext(cidList[index + 1])}
                                downloadResume={downloadResume}
                            />
                        ))}
                        {placeholder}
                    </div>
                )}
            </Droppable>
        );

        return (
            <Draggable draggableId={title} index={dropIndex}>
                {({ innerRef, dragHandleProps, draggableProps }: DraggableProvided) => (
                    <div ref={innerRef} {...draggableProps}>
                        <Paper className={classes.column}>
                            <div className={classes.columnHeader}>
                                <Typography
                                    variant='title'
                                    className={classes.columnTitle}
                                    {...dragHandleProps}
                                >{title}</Typography>
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
