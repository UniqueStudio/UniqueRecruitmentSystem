import { AppBar as MuiAppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import {
    Brightness4 as BrightnessIcon,
    Chat as ChatIcon,
    Help as HelpIcon,
    History as HistoryIcon,
    Menu as MenuIcon,
    Person as PersonIcon,
    Refresh as RefreshIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { clear } from 'idb-keyval';
import { observer } from 'mobx-react-lite';
import React, { FC, MouseEventHandler, useMemo, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { setAuthToken } from '@apis/rest';
import { Select } from '@components/Select';
import { GROUP_MAP, STEP_TYPE_MAP } from '@config/consts';
import { Group, StepType } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/appBar';
import { primitiveStorage } from '@utils/storage';
import { titleConverter } from '@utils/titleConverter';

export const AppBar: FC = observer(() => {
    const { url } = useRouteMatch();
    const classes = useStyles();
    const { $component, $user, $application, $recruitment } = useStores();
    const [logoutMenu, setLogoutMenu] = useState<Element | null>(null);
    const [darkModeMenu, setDarkModeMenu] = useState<Element | null>(null);

    const title = titleConverter($recruitment.viewingRecruitment?.name ?? '');
    const open = $component.drawerOpen;

    const openLogoutMenu: MouseEventHandler = ({ currentTarget }) => {
        setLogoutMenu(currentTarget);
    };

    const closeLogoutMenu = () => {
        setLogoutMenu(null);
    };

    const openDarkModeMenu: MouseEventHandler = ({ currentTarget }) => {
        setDarkModeMenu(currentTarget);
    };

    const closeDarkModeMenu = () => {
        setDarkModeMenu(null);
    };

    const handleLogout = () => {
        closeLogoutMenu();
        $user.logout();
        setAuthToken('');
    };

    const handleChangeDarkMode = (darkMode?: boolean) => () => {
        closeDarkModeMenu();
        $component.setDarkMode(darkMode);
    };

    const refresh = () => {
        void clear();
        primitiveStorage.clear();
        location.reload();
    };

    const pathToTitle = {
        '/': `Unique Studio Recruitment Dashboard v${__APP_VERSION__}`,
        '/dashboard': title ? `${title}・数据展示` : '数据展示',
        '/interviews': title ? `${title}・面试分配` : '面试分配',
        '/candidates': title ? `${title}・选手信息` : '选手信息',
        '/my': '组员信息',
    };

    return (
        <MuiAppBar position='fixed' className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
            <Toolbar disableGutters={!open} classes={{ gutters: classes.appBarGutters }}>
                {useMemo(
                    () => (
                        <IconButton
                            color='inherit'
                            onClick={() => $component.toggleDrawer()}
                            className={clsx(classes.menuButton, { [classes.hide]: open })}
                        >
                            <MenuIcon />
                        </IconButton>
                    ),
                    // eslint-disable-next-line
                    [open, classes.menuButton],
                )}
                <Typography variant='h6' color='inherit' noWrap>
                    {pathToTitle[url] || '808 / 2 = ?'}
                </Typography>
                {(url === '/candidates' || url === '/interviews') && (
                    <>
                        <Select
                            data={[...STEP_TYPE_MAP.entries()].map(([value, item]) => ({ value, item }))}
                            onChange={({ target }) => $application.setSteps(+(target.value as StepType))}
                            currentValue={$application.stepType}
                        />
                        {$application.stepType !== StepType.teamInterview && (
                            <Select
                                data={[...GROUP_MAP.entries()].map(([value, item]) => ({ value, item }))}
                                onChange={({ target }) => $application.setGroup(target.value as Group)}
                                currentValue={$application.group}
                            />
                        )}
                    </>
                )}
                <div className={clsx(open && classes.hide, classes.rightButtons)}>
                    <IconButton color='inherit' onClick={() => $component.toggleRecruitmentPanel()}>
                        <HistoryIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={() => $component.toggleMessenger()}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={() => $component.toggleSuggestion()}>
                        <HelpIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={refresh}>
                        <RefreshIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={openDarkModeMenu}>
                        <BrightnessIcon />
                    </IconButton>
                    <IconButton color='inherit' onClick={openLogoutMenu}>
                        <PersonIcon />
                    </IconButton>
                </div>
                <Menu anchorEl={logoutMenu} open={!!logoutMenu} onClose={closeLogoutMenu}>
                    <MenuItem onClick={handleLogout}>退出</MenuItem>
                </Menu>
                <Menu anchorEl={darkModeMenu} open={!!darkModeMenu} onClose={closeDarkModeMenu}>
                    <MenuItem onClick={handleChangeDarkMode()}>跟随系统</MenuItem>
                    <MenuItem onClick={handleChangeDarkMode(true)}>开启</MenuItem>
                    <MenuItem onClick={handleChangeDarkMode(false)}>关闭</MenuItem>
                </Menu>
            </Toolbar>
        </MuiAppBar>
    );
});
