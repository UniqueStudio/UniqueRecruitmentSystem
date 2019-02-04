import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import {
    EnqueueSnackbar,
    enqueueSnackbar,
    setUserInfoStart,
    SetUserInfoStart
} from '../../actions';
import { StoreState } from '../../reducers';

import My from '../../views/My';

const mapStateToProps = ({ user: { groupInfo, info } }: StoreState) => ({
    groupInfo,
    userInfo: info,
});

type DispatchType =
    Dispatch<EnqueueSnackbar | SetUserInfoStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    enqueueSnackbar: (message: string, options?: OptionsObject) => dispatch(enqueueSnackbar(message, options)),
    submitInfo: (info: { phone: string, mail: string, password?: string }) => dispatch(setUserInfoStart(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(My);
