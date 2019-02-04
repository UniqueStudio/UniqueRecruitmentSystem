import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getQRCodeStart, loginStart } from '../../actions';
import { StoreState } from '../../reducers';

import LoginComponent from '../../components/Login';

const mapStateToProps = ({ user: { token, key: weChatKey, isScanning }, component: { progressOn } }: StoreState) => ({
    loggedIn: Boolean(token),
    weChatKey,
    isScanning,
    isLoading: progressOn
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    getQRCode: () => dispatch(getQRCodeStart()),
    login: (phone: string, password: string) => dispatch(loginStart(phone, password))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
