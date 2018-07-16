import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { toggleDrawerOpen, ToggleDrawerOpen } from '../../action';
import Menu from '../../component/Menu';

const mapStateToProps = ({ components }: StoreState) => ({
    open: components.drawerOpen
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawerOpen>) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);