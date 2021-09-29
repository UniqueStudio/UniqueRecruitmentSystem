import {
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon,
    DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { Divider, Drawer as MuiDrawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Anchor } from '@components/Anchor';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/drawer';

const listItems = [
    { path: '/', text: '首页', exact: true, icon: <HomeIcon /> },
    { path: '/dashboard', text: '招新数据', icon: <TimelineIcon /> },
    { path: '/interviews', text: '面试信息', icon: <DateRangeIcon /> },
    { path: '/applications', text: '选手信息', icon: <DashboardIcon /> },
    { path: '/my', text: '组员信息', icon: <PeopleIcon /> },
];

export const Drawer: FC = observer(() => {
    const { $component } = useStores();
    const classes = useStyles();

    return (
        <MuiDrawer
            variant='permanent'
            classes={{ paper: clsx(classes.drawerPaper, !$component.drawerOpen && classes.drawerPaperClose) }}
            open={$component.drawerOpen}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={() => $component.toggleDrawer()}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                {listItems.map(({ path, text, icon, exact }, index) => (
                    <Anchor to={path} key={index}>
                        <ListItem
                            button
                            selected={!!useRouteMatch({ path, exact })}
                            onClick={() => $component.toggleDrawer(false)}
                        >
                            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </Anchor>
                ))}
            </List>
        </MuiDrawer>
    );
});
