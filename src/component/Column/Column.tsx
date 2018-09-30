import React, { Component } from 'react';
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Candidate, STEPS } from '../../lib/const';

import styles from '../../style/column';
import withRoot from '../../style/withRoot';

import CandidateContainer from '../Candidate/CandidateContainer';

interface Props extends WithStyles {
    title: string;
    dropIndex: number;
    isDragging: boolean;
    candidates: Map<string, Candidate>;
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

    // componentWillReceiveProps(nextProps: Props) {
    //     const { group, title } = this.props;
    //     if (nextProps.group !== group) {
    //         this.props.toggleModalOff();
    //     }
    //     if (nextProps.fabOn === titleToStep(title)) {
    //         if (nextProps.selected.length === 0) {
    //             this.props.toggleFabOff();
    //             if (this.state.buttons) {
    //                 this.toggleButtons();
    //             }
    //             setTimeout(() => this.setState({ fab: false }), 225)
    //         } else {
    //             this.setState({
    //                 fab: true
    //             })
    //         }
    //     }
    // }

    render() {
        const { classes, title, candidates, selected, modalOn, toggleModalOff, dropIndex, downloadResume } = this.props;
        const allCid = [...candidates.keys()];
        const selectedCid = selected.filter((i) => allCid.includes(i));

        const DropArea = (
            <Droppable droppableId={title} type='CANDIDATE'>
                {(dropProvided: DroppableProvided) => (
                    <div className={classes.columnBody}
                         ref={(element) => dropProvided.innerRef(element)}
                         {...dropProvided.droppableProps}
                    >
                        {[...candidates.entries()].map((i: [string, Candidate], j: number) => (
                            <CandidateContainer
                                i={i}
                                j={j}
                                key={j}
                                disabled={i[1].abandon || i[1].rejected || selectedCid.includes(i[0])}
                                toggleModalOff={toggleModalOff}
                                modalOn={modalOn}
                                step={titleToStep(title)}
                                direction={this.state.direction}
                                handlePrev={this.handlePrev(allCid[j - 1])}
                                handleNext={this.handleNext(allCid[j + 1])}
                                downloadResume={downloadResume}
                            />
                        ))}
                        {dropProvided.placeholder}
                    </div>
                )}
            </Droppable>
        );

        return (
            <Draggable draggableId={title} index={dropIndex}>
                {(provided: DraggableProvided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Paper className={classes.column}>
                            <div className={classes.columnHeader}>
                                <Typography
                                    variant='title'
                                    className={classes.columnTitle}
                                    {...provided.dragHandleProps}
                                >{title}</Typography>
                            </div>
                            <Divider/>
                            {DropArea}
                        </Paper>
                    </div>
                )}
            </Draggable>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
