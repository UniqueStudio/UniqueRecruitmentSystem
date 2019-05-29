import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import styles from '../styles/noMatch';

import fourOFour from '../images/404.png';
import logo from '../images/logo.png';

class NoMatch extends PureComponent<WithStyles<typeof styles>> {
    render() {
        const { classes } = this.props;
        return (
            <>
                <div className={classes.container}>
                    <img src={logo} className={classes.logo} alt='logo' />
                    <img src={fourOFour} className={classes.fourOFour} alt='404!' />
                </div>
            </>
        );
    }
}

export default withStyles(styles)(NoMatch);
