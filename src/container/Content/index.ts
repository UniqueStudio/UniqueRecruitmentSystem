import { connect } from 'react-redux';
import Content from '../../component/Content'
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { toggleDrawerOpen } from '../../action';

const mapStateToProps = ({ components, routerReducer }: StoreState) => ({
    open: components.drawerOpen,
    path: routerReducer.location
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);