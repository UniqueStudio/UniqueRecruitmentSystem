import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import withRoot from "../style/withRoot";
import styles from "../style/style";

class Index extends React.Component<WithStyles> {
    render() {
        return (
            <div>
                index
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Index));
