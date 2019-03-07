import React, { PureComponent } from 'react';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { OptionsObject } from 'notistack';

import { Candidate, Comment, Evaluation, User } from '../../config/types';

import styles from '../../styles/column';

import Comments from './Comments';
import Info from './Info';

interface Props extends WithStyles<typeof styles> {
    index: number;
    candidate: Candidate;
    user: User;
    progress: number;
    savedComment: {
        content: string;
        evaluation: Evaluation
    };
    handlePrev: (index: number) => void;
    handleNext: (index: number) => void;
    submit: (cid: string, comment: Partial<Comment>) => void;
    remove: (cid: string, id: string) => void;
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    changeInputting: (content: string, evaluation: Evaluation) => void;
    getResume: (cid: string) => void;
    handleTodo: () => void;
}

interface State {
    candidate: Candidate;
}

class Detail extends PureComponent<Props, State> {

    state = {
        candidate: this.props.candidate
    };

    componentDidUpdate() {
        this.setState((prevState, { candidate }) => ({
            candidate: candidate || prevState.candidate
        }));
    }

    handleClick = (type: string) => () => {
        const { handlePrev, handleNext, changeInputting, index } = this.props;
        changeInputting('', 2);
        type === 'prev' ? handlePrev(index) : handleNext(index);
    };

    componentWillUnmount() {
        this.props.handleTodo();
    }

    render() {
        const { classes, getResume, user, enqueueSnackbar, remove, changeInputting, savedComment, submit, progress } = this.props;
        const { candidate } = this.state;
        const { _id: cid, comments } = candidate;
        const { _id: uid, username } = user;
        return (
            <div className={classes.detailContent}>
                <IconButton className={classes.leftButton} onClick={this.handleClick('prev')}>
                    <ExpandMoreIcon />
                </IconButton>
                <div className={classes.detailMain}>
                    <Info info={candidate} getResume={getResume} progress={progress} />
                    <Comments
                        cid={cid}
                        comments={comments}
                        savedComment={savedComment}
                        uid={uid}
                        username={username}
                        enqueueSnackbar={enqueueSnackbar}
                        remove={remove}
                        submit={submit}
                        changeInputting={changeInputting}
                    />
                </div>
                <IconButton className={classes.rightButton} onClick={this.handleClick('next')}>
                    <ExpandMoreIcon />
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(Detail);
