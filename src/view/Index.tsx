import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import withRoot from "../style/withRoot";
import styles from "../style/index";
import Login from '../container/Login/index';
import logo from '../image/logo.png';
import welcome from '../image/welcome.png';

class Index extends React.PureComponent<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <>
                <div className={classes.indexImage}>
                    <img src={logo} className={classes.logoImage} />
                    <img src={welcome} className={classes.welcomeImage} />
                </div>
                <Login />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Index));
