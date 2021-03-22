import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { getCandidates, getGroup, getRecruitments, getUserInfo } from '../../apis/rest';
import AppBar from '../../components/AppBar';
import Drawer from '../../components/Drawer';
import { usePrevious } from '../../hooks/usePrevious';
import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/frame';
import Progress from '../Progress';

const Frame: FC = observer(({ children }) => {
    const { $component, $recruitment, $user } = useStores();
    const classes = useStyles();
    const prevTitle = usePrevious($recruitment.viewing);

    const handleClick = () => {
        $component.drawerOpen && $component.toggleDrawer();
    };

    useEffect(() => {
        if ($user.token) {
            void getUserInfo();
            void getRecruitments();
            void getGroup();
        }
    }, []);

    useEffect(() => {
        if (!prevTitle && $recruitment.viewing) {
            void getCandidates($recruitment.viewing);
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
