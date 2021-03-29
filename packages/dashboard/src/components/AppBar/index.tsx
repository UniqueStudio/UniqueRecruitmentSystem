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
import React, { ChangeEventHandler, FC, MouseEventHandler, useContext, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { setAuthToken } from '@apis/rest';
import { Select } from '@components/Select';
import { GROUP_MAP } from '@config/consts';
import { Group, StepType } from '@config/enums';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/appBar';
import { ThemeContext } from '@styles/withRoot';
import { localStorage } from '@utils/storage';
import { titleConverter } from '@utils/titleConverter';

export const AppBar: FC = observer(() => {
    const { pathname } = useLocation();
    const classes = useStyles();
    const { $component, $user, $candidate, $recruitment } = useStores();
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const { darkMode, setDarkMode } = useContext(ThemeContext);

    const title = titleConverter($recruitment.recruitments.get($recruitment.viewing)?.name ?? '');
    const open = $component.drawerOpen;

    const handleClick: MouseEventHandler = ({ currentTarget }) => {
        setAnchorEl(currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        $user.logout();
        setAuthToken('');
    };

    const handleChange = (type: 'group' | 'step'): ChangeEventHandler<{ name?: string; value: string }> => ({
        target: { value },
    }) => {
        type === 'group' && $candidate.setGroup(value as Group);
        type === 'step' && $candidate.setSteps(+value as StepType);
    };

    const refresh = () => {
        void clear();
        localStorage.clear();
        location.reload();
    };

    const defaultTitle = `Unique Studio Recruitment Dashboard v${import.meta.env.SNOWPACK_PUBLIC_VERSION}`;

    const pathToTitle = {
        '/': defaultTitle,
        '/dashboard': title ? `${title}・数据展示` : defaultTitle,
        '/data': title ? `${title}・/*TODO*/` : defaultTitle,
        '/candidates': title ? `${title}・选手信息` : defaultTitle,
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
                            className={clsx(classes.menuButton, { [classes.hide]: open })}>
                            <MenuIcon />
                        </IconButton>
                    ),
                    // eslint-disable-next-line
                    [open, classes.menuButton],
                )}
                <Typography variant='h6' color='inherit' noWrap>
                    {pathToTitle[pathname] || '808 / 2 = ?'}
                </Typography>
                {pathname === '/candidates' && (
                    <>
                        <Select
                            data={['全部', '群面']}
                            values={[StepType.all, StepType.interview]}
                            onChange={handleChange('step')}
                            currentValue={$candidate.stepType}
                        />
                        {$candidate.stepType === StepType.all && (
                            <Select
                                data={[...GROUP_MAP.values()]}
                                values={[...GROUP_MAP.keys()]}
                                onChange={handleChange('group')}
                                currentValue={$candidate.group}
                            />
                        )}
                    </>
                )}
                {useMemo(
                    () => (
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
                            <IconButton color='inherit' onClick={setDarkMode}>
                                <BrightnessIcon />
                            </IconButton>
                            <IconButton color='inherit' onClick={handleClick}>
                                <PersonIcon />
                            </IconButton>
                        </div>
                    ),
                    [open, darkMode],
                )}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                    <MenuItem onClick={handleLogout}>退出</MenuItem>
                </Menu>
            </Toolbar>
        </MuiAppBar>
    );
});
