import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import AppBar from "../container/AppBar";
import Menu from "../container/Menu";
import Snackbar from '../container/Snackbar';
import styles from "../style/style";

class Main extends React.Component<WithStyles> {
    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <AppBar />
                <Menu />
                <main className={classes.content}>
                    {children}
                    <Snackbar />
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);
