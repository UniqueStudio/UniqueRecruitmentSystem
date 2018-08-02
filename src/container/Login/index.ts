import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getQRCode, login } from '../../action/async';
import LoginComponent from '../../component/Login';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    loggedIn: user.loggedIn,
    isLoading: user.isLoading,
    weChatKey: user.key,
    buttonAble: user.qRCodeGettable
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    login: (username: string) => login(username)(dispatch),
    getQRCode: () => getQRCode()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);