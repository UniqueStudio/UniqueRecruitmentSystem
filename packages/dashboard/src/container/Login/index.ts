import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { login, Login } from '../../action';
import LoginComponent from '../../component/Login';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    loggedIn: user.loggedIn
});

const mapDispatchToProps = (dispatch: Dispatch<Login>) => ({
    login: (username: string) => dispatch(login(username))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);