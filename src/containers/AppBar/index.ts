import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from 'redux';

import {
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

type DispatchType = Dispatch<ToggleDrawer | Logout | SetGroup | SetSteps>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleDrawer: () => dispatch(toggleDrawer()),
    logout: () => dispatch(logout()),
    setGroup: (group: Group) => dispatch(setGroup(group)),
    setSteps: (stepType: number) => dispatch(setSteps(stepType)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));
