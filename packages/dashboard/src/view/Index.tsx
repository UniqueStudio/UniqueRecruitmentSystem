import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import withRoot from "../style/withRoot";
import styles from "../style/index";
import Login from '../container/Login';
import welcome from '../image/welcome.png';

class Index extends React.Component<WithStyles> {
    render() {
        return (
            <>
                <img src={welcome} />
                <Login />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Index));
