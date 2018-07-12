import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import withRoot from "../style/withRoot";
import styles from "../style/index";

class Data extends React.Component<WithStyles> {
    render() {
        return (
            <div>
                data
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Data));
