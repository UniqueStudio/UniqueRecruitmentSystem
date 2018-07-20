import * as React from 'react';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Menu as MenuIcon, Person as PersonIcon } from '@material-ui/icons';
import styles from '../../style/index'
import withRoot from '../../style/withRoot';
import Select from '../../container/AppBar/AppBarSelect';
import Anchor from '../Anchor';
import { Redirect, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { history } from '../../App';
import Progress from '../Progress';

// import logo from '../image/logo.png';

interface Props extends WithStyles {
    open: boolean;
    path: string;
    loggedIn: boolean;
    loading: boolean;
    toggleOpen: () => void;
    logout: () => void;
}

interface HeaderProps {
    title: string;
}

class Header extends React.Component<HeaderProps> {
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

class Bar extends React.Component<Props> {
    state = {
        anchorEl: undefined,
    };

    handleClick = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, open, loading, loggedIn, toggleOpen, logout, path } = this.props;
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
                        <Route path='/view'
                               render={(props) => <Header title='8102年秋季招新' {...props}><Select /></Header>} />
                        <Route path='/my' render={(props) => <Header title='个人信息管理' {...props} />} />
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
                                    <Anchor to='/my'><MenuItem onClick={this.handleClose}>个人信息</MenuItem></Anchor>
                                    <MenuItem onClick={() => {
                                        this.handleClose();
                                        logout();
                                    }}>退出</MenuItem>
                                </Menu>
                            </> : path !== '/' && <Redirect to='/' />}
                    </Toolbar>
                    {loading && <Progress />}
                </AppBar>
            </ConnectedRouter>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
