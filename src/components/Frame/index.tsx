import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Progress from '../Progress';

import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';

import { usePrevious } from '../../hooks/usePrevious';

import { observer } from 'mobx-react-lite';
import { getCandidates, getGroup, getRecruitments, getUserInfo } from '../../apis/rest';
import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/frame';

const Frame: FC = observer(({ children }) => {
    const { componentStateStore, recruitmentStore, userStore } = useStores();
    const classes = useStyles();
    const prevTitle = usePrevious(recruitmentStore.viewing);

    const handleClick = () => {
        componentStateStore.drawerOpen && componentStateStore.toggleDrawer();
    };

    useEffect(() => {
        if (userStore.token) {
            getUserInfo();
            getRecruitments();
            getGroup();
        }
    }, []);

    useEffect(() => {
        if (!prevTitle && recruitmentStore.viewing) {
            getCandidates(recruitmentStore.viewing);
        }
    }, [prevTitle, recruitmentStore.viewing]);

    return userStore.token ? (
        <div className={classes.root}>
            <AppBar />
            <Drawer />
            <main className={classes.content} onClick={handleClick}>
                {userStore.info && children}
            </main>
            {componentStateStore.progressOn && <Progress />}
        </div>
    ) : (
        <Redirect to='/login' />
    );
});

export default Frame;
