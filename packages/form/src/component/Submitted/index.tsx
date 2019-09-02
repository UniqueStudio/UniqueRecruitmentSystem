import React from 'react';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import styles from '../../style/Submitted';

interface Props extends WithStyles<typeof styles> {
    title: string;
    description: string;
    className?: string;
}

function Submitted(props: Props) {
    const { className, title, description, classes } = props;
    return (
        <div className={classNames(classes.container, className)}>
            <div className={classes.box}>
                <div className={classes.title}>
                    <span>{title}</span>
                    <svg className={classes.svg} viewBox='0 0 24 24'>
                        <path fill='none' d='M0 0h24v24H0z' />
                        <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' />
                    </svg>
                </div>
                <div className={classes.description}>{description}</div>
            </div>
        </div>
    );
}

export default withStyles(styles)(Submitted);
