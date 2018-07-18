import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { login } from '../../action/async';
import LoginComponent from '../../component/Login';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    loggedIn: user.loggedIn
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    login: (username: string) => login(username)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);