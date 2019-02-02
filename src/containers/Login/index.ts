import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getQRCodeStart } from '../../actions';
import { StoreState } from '../../reducers';

import LoginComponent from '../../components/Login';

const mapStateToProps = ({ user: { token, key: weChatKey, isScanning } }: StoreState) => ({
    loggedIn: Boolean(token),
    weChatKey,
    isScanning,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // login: (username: string) => login(username)(dispatch),
    getQRCode: () => dispatch(getQRCodeStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
