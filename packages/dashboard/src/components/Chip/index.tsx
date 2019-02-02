import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Comment } from '../../config/types';

import styles from '../../styles/chip';

interface Props extends WithStyles {
    comment: Comment;
    onRemove?: () => void;
    onCopy?: () => void;
}

class CommentChip extends PureComponent<Props> {

    state = {
        anchorEl: undefined,
    };

    handleOpen = ({ currentTarget }: React.MouseEvent) => {
        this.setState({ anchorEl: currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    render() {
        const { comment, classes, onCopy, onRemove } = this.props;
        const { content, evaluation, username } = comment;
        let text = `${username}： ${content}`;
        text = text.length > 15 ? text.slice(0, 15) + '…' : text;
        const color = ['danger', 'warning', 'success'][evaluation];
        return (
            <>
                <Chip
                    label={text}
                    className={classes.chip}
                    classes={{
                        root: classNames(classes[color], classes[`root-${color}`]),
                    }}
                    onMouseOver={this.handleOpen}
                    onMouseOut={this.handleClose}
                    onClick={onCopy}
                    onDelete={onRemove}
                />
                <Popover
                    className={classes.popover}
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={this.handleClose}
                    disableRestoreFocus
                >
                    <Paper className={classNames(classes.content, classes[color])}>{content}</Paper>
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(CommentChip);
