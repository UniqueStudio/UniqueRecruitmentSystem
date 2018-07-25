import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import AppBar from "../container/AppBar/AppBar";
import Menu from "../container/Menu/index";
import styles from "../style/index";
import withRoot from "../style/withRoot";

import Content from "../container/Content";

class Main extends React.PureComponent<WithStyles> {
    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll, { passive: true })
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll)
    }

    handleScroll(event: any) {

    }

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
