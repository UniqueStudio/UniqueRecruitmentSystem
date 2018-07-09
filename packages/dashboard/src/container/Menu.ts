import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../reducer';
import { toggleDrawerOpen, ToggleDrawerOpen } from '../action';
import Menu from '../component/Menu';

const mapStateToProps = ({ drawerOpen }: StoreState) => ({
    open: drawerOpen
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawerOpen>) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);