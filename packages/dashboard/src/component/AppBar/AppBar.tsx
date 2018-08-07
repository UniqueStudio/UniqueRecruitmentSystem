import React, { PureComponent } from "react";
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import styles from '../../style/appBar'
import withRoot from '../../style/withRoot';
import Select from '../../container/AppBar/AppBarSelect';
import Anchor from '../Anchor';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { history } from '../../App';

interface Props extends WithStyles {
    open: boolean;
    path: string;
    loggedIn: boolean;
    toggleOpen: () => void;
    logout: () => void;
}

interface HeaderProps {
    title: string;
}

class Header extends PureComponent<HeaderProps> {
    render() {
        const { title, children } = this.props;
        return (
            <>
                <Typography variant="title" color="inherit" noWrap>
                    {title}
                </Typography>
                {children}
            </>
        )
    }
}

class Bar extends PureComponent<Props> {
    state = {
        anchorEl: undefined,
    };

    handleClick = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    refresh = () => {
        const token = sessionStorage.getItem('token');
        const uid = sessionStorage.getItem('uid');
        const userInfo = sessionStorage.getItem('userInfo');
        sessionStorage.clear();
        token && sessionStorage.setItem('token', token);
        uid && sessionStorage.setItem('uid', uid);
        userInfo && sessionStorage.setItem('userInfo', userInfo);
        this.handleClose();
        location.reload();
    };

    render() {
        const { classes, open, loggedIn, toggleOpen, logout, path } = this.props;
        return (
            <ConnectedRouter history={history}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!open} classes={{
                        gutters: classes.appBarGutters
                    }}>
                        <IconButton
                            color="inherit"
                            onClick={toggleOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Route path='/' exact render={(props) => <Header title='联创团队招新管理系统' {...props} />} />
                        <Route path='/data' render={(props) => <Header title='历年数据展示' {...props} />} />
                        <Route path='/commonInterview'
                               render={(props) => <Header title='8102年秋季招新' {...props}><Select /></Header>} />
                        <Route path='/finalInterview' render={(props) => <Header title='8102秋招・群面' {...props} />} />
                        <Route path='/myInfo' render={(props) => <Header title='个人信息管理' {...props} />} />
                        <Route path='/myGroup' render={(props) => <Header title='组员信息管理' {...props} />} />
                        {loggedIn ?
                            <>
                                <IconButton
                                    color="inherit"
                                    className={classNames(classes.personButton, open && classes.hide)}
                                    onClick={this.handleClick}
                                >
                                    <PersonIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={this.state.anchorEl}
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleClose}
                                >
                                    <Anchor to='/myInfo'><MenuItem onClick={this.handleClose}>个人信息</MenuItem></Anchor>
                                    <Anchor to='/myGroup'><MenuItem onClick={this.handleClose}>组员信息</MenuItem></Anchor>
                                    <MenuItem onClick={this.refresh}>强制刷新</MenuItem>
                                    <MenuItem onClick={() => {
                                        this.handleClose();
                                        logout();
                                    }}>退出</MenuItem>
                                </Menu>
                            </> : path !== '/' && <Redirect to='/' />}
                    </Toolbar>
                </AppBar>
            </ConnectedRouter>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
