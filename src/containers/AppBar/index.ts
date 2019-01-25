import { Group } from 'Config/types';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';

import {
    GetCandidatesStart,
    getCandidatesStart,
    Logout,
    logout,
    SetGroup,
    setGroup,
    SetSteps,
    setSteps,
    ToggleDrawerOpen,
    toggleDrawerOpen
} from 'Actions';
import { StoreState } from 'Reducers';

import AppBar from 'Components/AppBar';

const mapStateToProps =
    ({ component: { drawerOpen }, user: { token }, candidate: { group, steps }, recruitment: { viewing } }: StoreState,
     ownProps: RouteComponentProps) => ({
        open: drawerOpen,
        loggedIn: Boolean(token),
        group,
        steps,
        viewingRecruitment: viewing,
        ...ownProps,
    });

type DispatchType = Dispatch<ToggleDrawerOpen | Logout | GetCandidatesStart | SetGroup | SetSteps>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleDrawerOpen: () => dispatch(toggleDrawerOpen()),
    logout: () => dispatch(logout()),
    setGroup: (group: Group) => dispatch(setGroup(group)),
    setSteps: (stepType: number) => dispatch(setSteps(stepType)),
    getCandidates: ({ group, step, title }: {
        group?: Group,
        step?: number,
        title: string
    }) => dispatch(getCandidatesStart(title, group, step)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));
