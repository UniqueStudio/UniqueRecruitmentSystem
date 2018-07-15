import * as React from 'react';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import { Menu as MenuIcon, Person as PersonIcon } from '@material-ui/icons';
import styles from '../../style/index'
import withRoot from '../../style/withRoot';
import Select from '../../container/AppBarSelect';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { history } from '../../App';
import Progress from '../Progress';

// import logo from '../image/logo.png';

interface Props extends WithStyles {
    open: boolean;
    loggedIn: boolean;
    loading: boolean;
    toggleOpen: () => void;
}

class Header extends React.Component<{ title: string }> {
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
    render() {
        const { classes, open, loading, loggedIn, toggleOpen } = this.props;
        return (
            <ConnectedRouter history={history}>
                <AppBar
                    position="absolute"
                    className={classNames(classes.appBar, open && classes.appBarShift)}
                >
                    <Toolbar disableGutters={!open}>
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
                        {loggedIn && <IconButton
                            color="inherit"
                            className={classes.personButton}
                        >
                            <PersonIcon />
                        </IconButton>}
                    </Toolbar>
                    {loading && <Progress />}
                </AppBar>
            </ConnectedRouter>
        );
    }
}

export default withRoot(withStyles(styles)(Bar));
