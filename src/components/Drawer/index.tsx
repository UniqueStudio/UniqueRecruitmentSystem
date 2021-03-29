import {
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import {
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Timeline as TimelineIcon,
} from '@material-ui/icons';
import PieChartIcon from '@material-ui/icons/PieChart';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';

import { Anchor } from '@components/Anchor';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/drawer';

const listItems = [
    { to: '/', text: '首页', icon: <HomeIcon /> },
    { to: '/dashboard', text: 'Dashboard', icon: <TimelineIcon /> },
    { to: '/data', text: '招新数据', icon: <PieChartIcon /> },
    { to: '/candidates', text: '选手信息', icon: <DashboardIcon /> },
    { to: '/my', text: '组员信息', icon: <PeopleIcon /> },
];

export const Drawer: FC = observer(() => {
    const { $component } = useStores();
    const classes = useStyles();

    return (
        <MuiDrawer
            variant='permanent'
            classes={{ paper: clsx(classes.drawerPaper, !$component.drawerOpen && classes.drawerPaperClose) }}
            open={$component.drawerOpen}>
            <div className={classes.toolbar}>
                <IconButton onClick={() => $component.toggleDrawer()}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                {listItems.map(({ to, text, icon }, index) => (
                    <Anchor to={to} key={index}>
                        <ListItem button onClick={$component.drawerOpen ? () => $component.toggleDrawer() : undefined}>
                            <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    </Anchor>
                ))}
            </List>
        </MuiDrawer>
    );
});
