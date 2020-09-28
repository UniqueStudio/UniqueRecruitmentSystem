import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { removeSnackbar } from '../../actions';
import { StoreState } from '../../reducers';

import Notifier from '../../components/Notifier';

const mapStateToProps = ({ component: { snackbars } }: StoreState) => ({
    notifications: snackbars,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            removeSnackbar,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Notifier);
