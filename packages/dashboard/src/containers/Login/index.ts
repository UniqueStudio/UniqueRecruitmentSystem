import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getQRCodeStart, loginStart } from '../../actions';
import { StoreState } from '../../reducers';

import Login from '../../components/Login';

const mapStateToProps = ({ user: { token, key: weChatKey, isScanning }, component: { progressOn } }: StoreState) => ({
    loggedIn: Boolean(token),
    weChatKey,
    isScanning,
    isLoading: progressOn,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            getQRCode: getQRCodeStart,
            login: loginStart,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Login);
