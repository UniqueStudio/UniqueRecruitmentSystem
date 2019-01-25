import React, { PureComponent } from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from 'Styles/noMatch';

import fourOFour from 'Images/404.webp';
import logo from 'Images/logo.webp';

class Index extends PureComponent<WithStyles> {
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

export default withStyles(styles)(Index);
