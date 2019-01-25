import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import Progress from 'Components/Progress';
import { User } from 'Config/types';
import AppBar from 'Containers/AppBar';
import Drawer from 'Containers/Drawer';
import styles from 'Styles/main';

interface Props extends WithStyles {
    open: boolean;
    loggedIn: boolean;
    viewingRecruitment: string;
    userInfo: User;
    loading: boolean;
    getUserInfo: () => void;
    toggleOpen: () => void;
    getRecruitments: () => void;
    getCandidates: (title: string) => void;
    getGroupInfo: () => void;
}

class Frame extends PureComponent<Props> {

    componentDidMount() {
        const { loggedIn, getGroupInfo, getRecruitments, getUserInfo, viewingRecruitment, getCandidates } = this.props;
        if (loggedIn) {
            getUserInfo();
            getRecruitments();
            getGroupInfo();
            viewingRecruitment && getCandidates(viewingRecruitment);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const { getCandidates, viewingRecruitment } = this.props;
        if (!prevProps.viewingRecruitment && viewingRecruitment) {
            getCandidates(viewingRecruitment);
        }
    }

    handleClick = () => {
        const { open, toggleOpen } = this.props;
        open && toggleOpen();
    };

    render() {
        const { classes, children, loggedIn, userInfo, loading } = this.props;
        return (
            loggedIn ? <div className={classes.root}>
                <AppBar />
                <Drawer />
                <main className={classes.content} onClick={this.handleClick}>
                    {userInfo ? children : null}
                </main>
                {loading && <Progress />}
            </div> : <Redirect to='/login' />
        );
    }
}

export default withStyles(styles)(Frame);
