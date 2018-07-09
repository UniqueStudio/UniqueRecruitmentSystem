import * as React from "react";
import {
    Divider,
    Paper,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import styles from "../style/style";
import Candidate from "../container/Candidate";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    title: string;
    candidates: object;
}

const titleToStep = {
    '报名流程': '0',
    '笔试流程': '1',
    '面试流程': '2',
    '熬测流程': '3',
    '群面流程': '4',
};

class Column extends React.Component<Props> {
    render() {
        const { classes, title, candidates } = this.props;
        return (
            <Paper className={classes.column}>
                <Typography variant="headline" className={classes.columnTitle}>
                    {title}
                </Typography>
                <Divider />
                {Object.entries(candidates[titleToStep[title]]).map(i => (
                    <Candidate step={titleToStep[title]}
                               name={i[0]}
                               grade={i[1]['grade']}
                               institute={i[1]['institute']}
                               comments={i[1]['comments']}
                               key={i[0]}
                    />
                ))}
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
