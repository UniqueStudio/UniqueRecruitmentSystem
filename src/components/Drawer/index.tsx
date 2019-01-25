import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PieChartIcon from '@material-ui/icons/PieChart';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from 'Styles/drawer';

import Anchor from '../Anchor';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
}

class Menu extends PureComponent<Props> {

    render() {
        const { classes, open, toggleOpen } = this.props;
        return (
            <Drawer
                variant='permanent'
                classes={{
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={toggleOpen}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Anchor to='/'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon className={classes.icon}>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary='Dashboard' />
                        </ListItem>
                    </Anchor>
                    <Anchor to='/data'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon className={classes.icon}>
                                <PieChartIcon />
                            </ListItemIcon>
                            <ListItemText primary='招新数据' />
                        </ListItem>
                    </Anchor>
                    <Anchor to='/candidates'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon className={classes.icon}>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary='选手信息' />
                        </ListItem>
                    </Anchor>
                    <Anchor to='/my'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon className={classes.icon}>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary='组员信息' />
                        </ListItem>
                    </Anchor>
                </List>
            </Drawer>
        );
    }
}

export default withStyles(styles)(Menu);
