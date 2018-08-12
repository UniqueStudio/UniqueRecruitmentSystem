import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getQRCode } from '../../action';
import LoginComponent from '../../component/Login';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    loggedIn: user.loggedIn,
    isLoading: user.isLoading,
    weChatKey: user.key,
    isScanning: user.isScanning
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // login: (username: string) => login(username)(dispatch),
    getQRCode: () => dispatch(getQRCode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);