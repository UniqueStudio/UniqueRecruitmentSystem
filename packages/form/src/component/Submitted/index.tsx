import classNames from 'classnames';
import React, { FC, memo } from 'react';

import useStyles from '../../style/Submitted';

interface SubmittedProps {
    title: string;
    description: string | JSX.Element;
    className?: string;
}

const Submitted: FC<SubmittedProps> = memo(({ title, description, className }) => {
    const classes = useStyles();
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
});

export default Submitted;
