import React, { FC, memo } from 'react';

import useStyles from '../styles/noMatch';

import fourOFour from '../images/404.png';
import logo from '../images/logo.png';

const NoMatch: FC = memo(() => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <img src={logo} className={classes.logo} alt='logo' />
            <img src={fourOFour} className={classes.fourOFour} alt='404!' />
        </div>
    );
});

export default NoMatch;
