import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import AppBar from "../container/AppBar/AppBar";
import Menu from "../container/Menu/index";
import styles from "../style/index";
import withRoot from "../style/withRoot";

import Content from "../container/Content";

class Main extends React.Component<WithStyles> {

    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <AppBar />
                <Menu />
                <Content children={children} />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Main));
