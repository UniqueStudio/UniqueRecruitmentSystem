import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import AppBar from "../container/AppBar/AppBar";
import Menu from "../container/Menu/index";
import styles from "../style/index";
import withRoot from "../style/withRoot";

import Content from "../container/Content";

class Main extends React.PureComponent<WithStyles> {
    componentDidMount() {
        window.addEventListener('wheel', this.handleScroll as any, { passive: true })
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleScroll as any)
    }

    handleScroll(event: React.WheelEvent) {
        document.getElementById('main')!.scrollLeft += event.deltaY / 2;
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
