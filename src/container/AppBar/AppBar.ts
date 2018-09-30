import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StoreState } from '../../reducer';
import {
    GetCandidatesStart,
    getCandidatesStart,
    logout,
    Logout,
    toggleDrawerOpen,
    ToggleDrawerOpen
} from '../../action';
import AppBar from '../../component/AppBar/AppBar';

const mapStateToProps = ({ components, user, candidates, recruitments }: StoreState, ownProps: RouteComponentProps<{}>) => ({
    open: components.drawerOpen,
    loggedIn: user.loggedIn,
    group: candidates.group,
    pendingRecruitment: recruitments.pending,
    ...ownProps
});

type DispatchType = Dispatch<ToggleDrawerOpen | Logout | GetCandidatesStart>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
    logout: () => dispatch(logout()),
    getCandidates: (group: string, recruitmentName: string) => dispatch(getCandidatesStart(group, recruitmentName))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));