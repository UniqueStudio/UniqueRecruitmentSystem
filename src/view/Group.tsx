import React, { PureComponent } from "react";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import withRoot from "../style/withRoot";
import styles from '../style/group';
import ColumnContainer from '../container/Column/ColumnContainer';
import Messenger from '../container/Messenger';

class Group extends PureComponent<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <ColumnContainer />
                <Messenger />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Group));
