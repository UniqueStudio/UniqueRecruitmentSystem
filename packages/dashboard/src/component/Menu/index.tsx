import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import PieChartIcon from '@material-ui/icons/PieChart';

import styles from '../../style/menu';
import withRoot from '../../style/withRoot';

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
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary='首页'/>
                        </ListItem>
                    </Anchor>
                    <Anchor to='/data'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon>
                                <PieChartIcon />
                            </ListItemIcon>
                            <ListItemText primary='历年数据'/>
                        </ListItem>
                    </Anchor>
                    <Anchor to='/candidates'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary='报名审核'/>
                        </ListItem>
                    </Anchor>
                    <Anchor to='/massInterview'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon>
                                <GroupWorkIcon />
                            </ListItemIcon>
                            <ListItemText primary='群面审核'/>
                        </ListItem>
                    </Anchor>
                    <Anchor to='/myInfo'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary='个人信息'/>
                        </ListItem>
                    </Anchor>
                    <Anchor to='/myGroup'>
                        <ListItem button onClick={open ? toggleOpen : undefined}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary='组员信息'/>
                        </ListItem>
                    </Anchor>
                </List>
            </Drawer>
        );
    }
}

export default withRoot(withStyles(styles)(Menu));
