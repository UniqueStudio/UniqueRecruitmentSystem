import * as React from "react";
import { Chip, WithStyles, withStyles } from "@material-ui/core";

import styles from "../style/style";

interface Props extends WithStyles {
    name: string;
    comment: string;
}

const evaluationToStyle = {
    '好': "success",
    '中': "warning",
    '差': "danger"
};

class Comment extends React.Component<Props> {
    render() {
        const { name, comment, classes } = this.props;
        return (
            <Chip
                label={`${name}： ${comment["comment"]}`}
                className={classes.chip}
                classes={{
                    root: classes[evaluationToStyle[comment["evaluation"]]]
                }}
            />
        );
    }
}

export default withStyles(styles)(Comment);
