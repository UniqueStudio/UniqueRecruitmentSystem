import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { toggleDrawer, ToggleDrawer } from 'Actions';
import { StoreState } from 'Reducers';

import Drawer from 'Components/Drawer';

const mapStateToProps = ({ component: { drawerOpen: open } }: StoreState) => ({
    open,
});

const mapDispatchToProps = (dispatch: Dispatch<ToggleDrawer>) => ({
    toggleOpen: () => dispatch(toggleDrawer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
