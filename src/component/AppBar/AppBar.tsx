import React, { PureComponent } from "react";
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import RefreshIcon from '@material-ui/icons/Refresh';
import styles from '../../style/appBar'
import withRoot from '../../style/withRoot';
import Select from './AppBarSelect';
import Anchor from '../Anchor';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Header } from './Header';
import { GROUPS, GROUPS_, STEPS } from '../../lib/const';
import titleConverter from "../../lib/titleConverter";
import { version } from '../../../package.json';

interface Props extends WithStyles {
    open: boolean;
    loggedIn: boolean;
    pendingRecruitment: string;
    group: string;
    toggleOpen: () => void;
    logout: () => void;
    getCandidates: (group: string, recruitmentName: string) => void;
}

class Bar extends PureComponent<Props & RouteComponentProps<{}>> {
    state = {
        anchorEl: undefined,
    };

    handleClick = (event: React.MouseEvent) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleLogout = () => {
        this.handleClose();
        this.props.logout();
    };

    handleChange = (event: React.ChangeEvent) => {
        const { getCandidates, pendingRecruitment } = this.props;
        getCandidates(event.target['value'], pendingRecruitment);
    };

    refresh = () => {
        sessionStorage.clear();
        window.location.reload();
    };

    render() {
        const { classes, open, loggedIn, toggleOpen, location, group, pendingRecruitment } = this.props;
        const { pathname } = location;
        const pathToTitle = {
            '/': `联创团队招新管理系统 v${version}`,
            '/candidates': titleConverter(pendingRecruitment),
            '/data': '历年数据展示',
            '/massInterview': `${titleConverter(pendingRecruitment)}・群面`,
            '/myInfo': '个人信息管理',
            '/myGroup': '组员信息管理',
        };
        return (
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
                        <MenuIcon/>
                    </IconButton>
                    <Header title={pathToTitle[pathname]}>
                        {pathname === '/candidates' && <>
                            <Select data={GROUPS} values={GROUPS_} onChange={this.handleChange} currentValue={group}/>
                            <Select data={STEPS} values={STEPS} currentValue=''/>
                        </>}
                    </Header>
                    {loggedIn ?
                        <>
                            <div className={classes.rightButtons}>
                                <IconButton
                                    color="inherit"
                                    onClick={this.refresh}
                                >
                                    <RefreshIcon/>
                                </IconButton>
                                <IconButton
                                    color="inherit"
                                    className={classNames(open && classes.hide)}
                                    onClick={this.handleClick}
                                >
                                    <PersonIcon/>
                                </IconButton>
                            </div>
                            <Menu
                                anchorEl={this.state.anchorEl}
                                open={Boolean(this.state.anchorEl)}
                                onClose={this.handleClose}
                                className={classes.options}
                            >
                                <Anchor to='/myInfo'><MenuItem onClick={this.handleClose}>个人信息</MenuItem></Anchor>
                                <Anchor to='/myGroup'><MenuItem onClick={this.handleClose}>组员信息</MenuItem></Anchor>
                                <MenuItem onClick={this.handleLogout}>退出</MenuItem>
                            </Menu>
                        </> : location.pathname !== '/' && <Redirect to='/'/>}
                </Toolbar>
            </AppBar>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
