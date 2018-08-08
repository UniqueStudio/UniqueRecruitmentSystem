import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StoreState } from '../../reducer';
import { logout, Logout, toggleDrawerOpen, ToggleDrawerOpen } from '../../action';
import AppBar from '../../component/AppBar/AppBar';

const mapStateToProps = ({ components, user }: StoreState, ownProps: RouteComponentProps<{}>) => ({
    open: components.drawerOpen,
    loggedIn: user.loggedIn,
});

type DispatchType = Dispatch<ToggleDrawerOpen | Logout>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
    logout: () => dispatch(logout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));