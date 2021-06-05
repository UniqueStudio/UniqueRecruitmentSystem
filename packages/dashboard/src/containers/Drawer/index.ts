import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { toggleDrawer } from '../../actions';
import { StoreState } from '../../reducers';

import Drawer from '../../components/Drawer';

const mapStateToProps = ({ component: { drawerOpen: open } }: StoreState) => ({
    open,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            toggleOpen: toggleDrawer,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Drawer);
