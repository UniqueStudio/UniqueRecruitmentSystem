import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../style/massInterview';
import withRoot from '../style/withRoot';

import ColumnContainer from '../container/Column/ColumnContainer';
import Messenger from '../container/Messenger';

class MassInterview extends PureComponent<WithStyles> {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <ColumnContainer type='massInterview'/>
                <Messenger />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(MassInterview));
