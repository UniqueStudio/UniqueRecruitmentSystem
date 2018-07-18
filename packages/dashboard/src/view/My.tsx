import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import withRoot from "../style/withRoot";
import styles from "../style/index";
import User from '../container/User';

class My extends React.Component<WithStyles> {
    render() {
        return (
            <>
                <User />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(My));
