import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { toggleDrawer, ToggleDrawer } from '../../actions';
import { StoreState } from '../../reducers';

import Drawer from '../../components/Drawer';

const mapStateToProps = ({ component: { drawerOpen: open } }: StoreState) => ({
    open,
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawer>) => ({
    toggleOpen: () => dispatch(toggleDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
