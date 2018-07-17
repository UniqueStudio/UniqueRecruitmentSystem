import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { toggleDrawerOpen, ToggleDrawerOpen } from '../../action';
import AppBar from '../../component/AppBar/AppBar';

const mapStateToProps = ({ components, user, candidates }: StoreState) => ({
    open: components.drawerOpen,
    loggedIn: user.loggedIn,
    loading: Object.values(candidates.isLoading).includes(true),
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawerOpen>) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);