import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../type';
import * as actions from '../action';
import AppBar from '../component/AppBar';

const mapStateToProps = ({drawerOpen}: StoreState) => ({
    open: drawerOpen
});

const mapDispatchToProps = (dispatch: Dispatch<actions.ToggleDrawerOpen>) => ({
    onClick: () => dispatch(actions.toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(AppBar);