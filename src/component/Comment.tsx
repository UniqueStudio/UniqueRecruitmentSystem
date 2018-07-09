import * as React from "react";
import { Avatar, Chip, WithStyles, withStyles } from "@material-ui/core";

import styles from "../style/style";

interface Props extends WithStyles {
    name: string;
    comment: string;
}

const evaluationToStyle = {
    '好': "good",
    '中': "soso",
    '差': "bad"
};

class Comment extends React.Component<Props> {
    render() {
        const { name, comment, classes } = this.props;
        return (
            <Chip
                avatar={<Avatar>{name}</Avatar>}
                label={comment["comment"]}
                className={classes.chip}
                classes={{
                    root: classes[evaluationToStyle[comment["evaluation"]]]
                }}
            />
        );
    }
}

export default withStyles(styles)(Comment);
