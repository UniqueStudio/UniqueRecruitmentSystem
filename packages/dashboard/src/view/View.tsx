import * as React from "react";
import { withStyles, WithStyles } from "@material-ui/core/styles";

import withRoot from "../style/withRoot";
import styles from "../style/index";

import ColumnContainer from '../container/Column/ColumnContainer';

class View extends React.PureComponent<WithStyles> {
    render() {
        return <ColumnContainer />;
    }
}

export default withRoot(withStyles(styles)(View));
