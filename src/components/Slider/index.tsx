import React, { PureComponent } from 'react';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import { Candidate } from '../../config/types';

import Comments from '../../containers/Comments';
import Detail from '../../containers/Detail';
import { ConnectedProps } from '../../containers/Slider';

import styles from '../../styles/slider';

type Props = WithStyles<typeof styles> & ConnectedProps;

interface State {
    candidate: Candidate;
}

class Slider extends PureComponent<Props, State> {
    state = {
        candidate: this.props.candidate,
    };

    componentDidUpdate() {
        this.setState((prevState, { candidate }) => ({
            candidate: candidate || prevState.candidate,
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
        const { classes } = this.props;
        const { candidate } = this.state;
        const { _id: cid, comments } = candidate;
        return (
            <div className={classes.detailContent}>
                <IconButton className={classes.leftButton} onClick={this.handleClick('prev')}>
                    <ExpandMoreIcon />
                </IconButton>
                <div className={classes.detailMain}>
                    <Detail info={candidate} />
                    <Comments cid={cid} comments={comments} />
                </div>
                <IconButton className={classes.rightButton} onClick={this.handleClick('next')}>
                    <ExpandMoreIcon />
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(Slider);
