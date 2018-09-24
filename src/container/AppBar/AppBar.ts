import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StoreState } from '../../reducer';
import { GetCandidates, getCandidates, logout, Logout, toggleDrawerOpen, ToggleDrawerOpen } from '../../action';
import AppBar from '../../component/AppBar/AppBar';

const mapStateToProps = ({ components, user, candidates }: StoreState, ownProps: RouteComponentProps<{}>) => ({
    open: components.drawerOpen,
    loggedIn: user.loggedIn,
    group: candidates.group
});

type DispatchType = Dispatch<ToggleDrawerOpen | Logout | GetCandidates>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
    logout: () => dispatch(logout()),
    changeGroup: (group: string) => dispatch(getCandidates(group))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));