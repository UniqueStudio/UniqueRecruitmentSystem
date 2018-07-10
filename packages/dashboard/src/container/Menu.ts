import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../reducer';
import { toggleDrawerOpen, ToggleDrawerOpen } from '../action';
import Menu from '../component/Menu';

const mapStateToProps = ({ componentsState }: StoreState) => ({
    open: componentsState.drawerOpen
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawerOpen>) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);