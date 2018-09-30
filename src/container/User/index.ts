import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Users from '../../component/User';

import {
    getUserInfoStart,
    GetUserInfoStart,
    setUserInfoStart,
    SetUserInfoStart,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

import { User } from '../../lib/const';

const mapStateToProps = ({ user }: StoreState) => ({
    uid: user.uid,
    info: user.info as User,
    isLoading: user.isLoading,
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetUserInfoStart | SetUserInfoStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchInfo: (uid: string) => dispatch(getUserInfoStart(uid)),
    submitInfo: (uid: string, info: User) => dispatch(setUserInfoStart(uid, info)),
    toggleSnackbar: (info: string, color: string) => dispatch(toggleSnackbarOn(info, color)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
