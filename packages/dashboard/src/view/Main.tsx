import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core";
import AppBar from "../container/AppBar";
import styles from "../style/style";
import Menu from "../container/Menu";

class Main extends React.Component<WithStyles> {
    render() {
        const { classes, children } = this.props;
        return (
            <div className={classes.root}>
                <AppBar />
                <Menu />
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {children}
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);
