import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { logout, Logout, toggleDrawerOpen, ToggleDrawerOpen } from '../../action';
import AppBar from '../../component/AppBar/AppBar';

const mapStateToProps = ({ components, user, candidates, routerReducer }: StoreState) => ({
    open: components.drawerOpen,
    loggedIn: user.loggedIn,
    loading: [...Object.values(candidates.isLoading), user.isLoading].includes(true),
    path: (routerReducer.location || {})['pathname']
});

type DispatchType = Dispatch<ToggleDrawerOpen | Logout>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);