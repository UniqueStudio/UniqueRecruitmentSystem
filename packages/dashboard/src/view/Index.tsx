import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../style/welcome';
import withRoot from '../style/withRoot';

import Login from '../container/Login/index';

import logo from '../image/logo.png';
import welcome from '../image/welcome.png';

class Index extends PureComponent<WithStyles> {
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
