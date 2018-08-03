import { connect } from 'react-redux';
import Content from '../../component/Content'
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { toggleDrawerOpen } from '../../action';

const mapStateToProps = ({ components, routerReducer, candidates, recruitments, user, sms }: StoreState) => ({
    open: components.drawerOpen,
    path: routerReducer.location,
    loading: [...Object.values(candidates.isLoading), user.isLoading, recruitments.isLoading, sms.isLoading].includes(true),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen())
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);