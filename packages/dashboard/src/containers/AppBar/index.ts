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
    ToggleDrawer,
    toggleDrawer
} from '../../actions';
import { Group } from '../../config/types';
import { StoreState } from '../../reducers';

import AppBar from '../../components/AppBar';

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

type DispatchType = Dispatch<ToggleDrawer | Logout | GetCandidatesStart | SetGroup | SetSteps>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
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
