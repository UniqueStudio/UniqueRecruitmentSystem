import * as React from "react";
import * as classnames from 'classnames';
import { Chip, Paper, Popover, WithStyles, withStyles } from "@material-ui/core";

import styles from '../../style/comment';

interface Props extends WithStyles {
    name: string;
    comment: string;
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
        this.setState({ anchorEl: event.target });
    };

    handleClose = () => {
        this.setState({ anchorEl: undefined });
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
                        root: classnames(classes[color], classes[`root-${color}`])
                    }}
                    onMouseOver={this.handleOpen}
                    onMouseOut={this.handleClose}
                />
                <Popover
                    className={classes.popover}
                    classes={{
                        paper: classes.paper,
                    }}
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
                    <Paper className={classnames(classes.content, classes[color])}>{comment["comment"]}</Paper>
                </Popover>
            </>
        );
    }
}

export default withStyles(styles)(CommentChip);
