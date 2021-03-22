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
    const { $component, $recruitment, $user } = useStores();
    const classes = useStyles();
    const prevTitle = usePrevious($recruitment.viewing);

    const handleClick = () => {
        $component.drawerOpen && $component.toggleDrawer();
    };

    useEffect(() => {
        if ($user.token) {
            getUserInfo();
            getRecruitments();
            getGroup();
        }
    }, []);

    useEffect(() => {
        if (!prevTitle && $recruitment.viewing) {
            getCandidates($recruitment.viewing);
        }
    }, [prevTitle, $recruitment.viewing]);

    return $user.token ? (
        <div className={classes.root}>
            <AppBar />
            <Drawer />
            <main className={classes.content} onClick={handleClick}>
                {$user.info && children}
            </main>
            {$component.progressOn && <Progress />}
        </div>
    ) : (
        <Redirect to='/login' />
    );
});

export default Frame;
