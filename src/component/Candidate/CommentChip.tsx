import * as React from "react";
import classNames from 'classnames';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/comment';

interface Props extends WithStyles {
    name: string;
    comment: string;
    remove: () => void;
}

const evaluationToStyle = {
    'good': "success",
    'so-so': "warning",
    'bad': "danger"
};

class CommentChip extends React.Component<Props> {

    state = {
        anchorEl: undefined,
    };

    handleOpen = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    };

    handleDelete = () => {
        this.props.remove();
    };

    render() {
        const { name, comment, classes } = this.props;
        let content = `${name}： ${comment["comment"]}`;
        content = content.length > 15 ? content.slice(0, 15) + '…' : content;
        const color = evaluationToStyle[comment["evaluation"]];
        return (
            <>
                <Chip
                    label={content}
                    className={classes.chip}
                    classes={{
                        root: classNames(classes[color], classes[`root-${color}`])
                    }}
                    onMouseOver={this.handleOpen}
                    onMouseOut={this.handleClose}
                    onDelete={name === 'AA' ? this.handleDelete : undefined}
                />
                <Popover
                    className={classes.popover}
                    open={Boolean(this.state.anchorEl)}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    onClose={this.handleClose}
                    disableRestoreFocus
                >
                    <Paper className={classNames(classes.content, classes[color])}>{comment["comment"]}</Paper>
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(CommentChip);
