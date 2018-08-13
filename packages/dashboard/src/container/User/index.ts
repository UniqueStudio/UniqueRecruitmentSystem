import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Users from '../../component/User';
import { StoreState } from '../../reducer';
import {
    getUserInfo,
    GetUserInfo,
    toggleSnackbarOn,
    ToggleSnackbarOn,
    updateUserInfo,
    UpdateUserInfo
} from '../../action';
import { User } from '../../lib/const';

const mapStateToProps = ({ user }: StoreState) => ({
    uid: user.uid,
    info: user.info as User,
    isLoading: user.isLoading
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetUserInfo | UpdateUserInfo>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchInfo: (uid: string) => dispatch(getUserInfo(uid)),
    submitInfo: (uid: string, info: User) => dispatch(updateUserInfo(uid, info)),
    toggleSnackbar: (info: string, color: string) => dispatch(toggleSnackbarOn(info, color)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);