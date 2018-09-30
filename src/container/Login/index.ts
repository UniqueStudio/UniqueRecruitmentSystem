import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { getQRCodeStart } from '../../action';
import { StoreState } from '../../reducer';

import LoginComponent from '../../component/Login';

const mapStateToProps = ({ user }: StoreState) => ({
    loggedIn: user.loggedIn,
    isLoading: user.isLoading,
    weChatKey: user.key,
    isScanning: user.isScanning,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // login: (username: string) => login(username)(dispatch),
    getQRCode: () => dispatch(getQRCodeStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
