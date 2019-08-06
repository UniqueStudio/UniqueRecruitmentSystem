import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar, setUserInfoStart } from '../../actions';
import { StoreState } from '../../reducers';

import User from '../../components/User';

const mapStateToProps = ({ user: { info } }: StoreState) => ({
    userInfo: info,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    enqueueSnackbar,
    submitInfo: setUserInfoStart,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(User);
