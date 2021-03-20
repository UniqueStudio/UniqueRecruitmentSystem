import React, { FC, memo, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Progress from '../Progress';

import AppBar from '../../containers/AppBar';
import Drawer from '../../containers/Drawer';
import { Props } from '../../containers/Frame';

import { usePrevious } from '../../hooks/usePrevious';

import useStyles from '../../styles/frame';

const Frame: FC<Props> = memo(
    ({
        children,
        loggedIn,
        userInfo,
        loading,
        open,
        toggleOpen,
        getRecruitments,
        getGroup,
        getUser,
        title,
        getCandidates,
    }) => {
        const classes = useStyles();
        const prevTitle = usePrevious(title);

        const handleClick = () => {
            open && toggleOpen();
        };

        useEffect(() => {
            if (loggedIn) {
                getUser();
                getRecruitments();
                getGroup();
            }
            // eslint-disable-next-line
        }, []);

        useEffect(() => {
            if (!prevTitle && title) {
                getCandidates(title);
            }
            // eslint-disable-next-line
        }, [prevTitle, title]);

        return loggedIn ? (
            <div className={classes.root}>
                <AppBar />
                <Drawer />
                <main className={classes.content} onClick={handleClick}>
                    {userInfo && children}
                </main>
                {loading && <Progress />}
            </div>
        ) : (
            <Redirect to='/login' />
        );
    },
);

export default Frame;
