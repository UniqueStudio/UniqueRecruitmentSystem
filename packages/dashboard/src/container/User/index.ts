import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Users from '../../component/User';
import { StoreState } from '../../reducer';
import { toggleSnackbarOn, ToggleSnackbarOn } from '../../action';
import { requestUser, updateUser } from '../../action/async';

const mapStateToProps = ({ user }: StoreState) => ({
    uid: user.uid,
    info: user.info,
    isLoading: user.isLoading
});

type DispatchType = Dispatch<ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchInfo: (uid: string) => requestUser(uid)(dispatch),
    submitInfo: (uid: string, info: object) => updateUser(uid, info)(dispatch),
    toggleSnackbar: (info: string, color: string) => dispatch(toggleSnackbarOn(info, color))
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);