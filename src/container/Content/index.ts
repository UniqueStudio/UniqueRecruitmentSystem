import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Content from '../../component/Content';

import { toggleDrawerOpen } from '../../action';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ components, candidates, recruitments, user, sms }: StoreState) => ({
    open: components.drawerOpen,
    loading: [...Object.values(candidates.isLoading), user.isLoading, recruitments.isLoading, sms.isLoading].includes(true),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
