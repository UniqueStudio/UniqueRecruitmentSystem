import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import withRoot from "../style/withRoot";
import styles from "../style/style";
import Column from "../container/Column";

class View extends React.Component<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.columnContainer}>
                <Column title="报名流程" />
                <Column title="笔试流程" />
                <Column title="面试流程" />
                <Column title="熬测流程" />
                <Column title="群面流程" />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(View));
