import * as React from "react";
import {
    withStyles,
    WithStyles
} from "@material-ui/core/styles";
import AppBar from "../container/AppBar";
import Menu from "../container/Menu";
import Snackbar from '../container/Snackbar';
import styles from "../style/index";
import withRoot from "../style/withRoot";

class Main extends React.Component<WithStyles> {

    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <AppBar />
                <Menu />
                {/* <LinearProgress className={classes.progress} /> */}
                <main className={classes.content}>
                    {children}
                    <Snackbar place='bl' />
                </main>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Main));
