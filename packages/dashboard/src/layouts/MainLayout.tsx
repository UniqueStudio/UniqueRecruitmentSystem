import { Toolbar } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { FC, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { getAllRecruitments, getApplications, getMyGroup, getMyInfo } from '@apis/rest';
import { AppBar } from '@components/AppBar';
import { Drawer } from '@components/Drawer';
import { Messenger } from '@components/Messenger';
import { Progress } from '@components/Progress';
import { RecruitmentPanel } from '@components/Recruitment/Panel';
import { Suggestion } from '@components/Suggestion';
import { usePrevious } from '@hooks/usePrevious';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/mainLayout';

export const MainLayout: FC = observer(({ children }) => {
    const { $component, $recruitment, $member } = useStores();
    const classes = useStyles();
    const prevTitle = usePrevious($recruitment.viewingId);

    const handleClick = () => {
        if ($component.drawerOpen) {
            $component.toggleDrawer();
        }
    };

    useEffect(() => {
        if ($member.token) {
            void getMyInfo();
            void getAllRecruitments();
            void getMyGroup();
        }
    }, []);

    useEffect(() => {
        if (!prevTitle && $recruitment.viewingId) {
            void getApplications($recruitment.viewingId);
        }
    }, [prevTitle, $recruitment.viewingId]);

    return $member.token ? (
        <>
            <AppBar />
            <div className={classes.root}>
                <Drawer />
                <main className={classes.content} onClick={handleClick}>
                    <Toolbar />
                    {$member.info.id && children}
                </main>
            </div>
            <Suggestion />
            <Messenger />
            <RecruitmentPanel />
            {$component.progressOn && <Progress />}
        </>
    ) : (
        <Redirect to='/login' />
    );
});
