import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import {
    enqueueSnackbar,
    EnqueueSnackbar,
    launchRecruitment,
    LaunchRecruitment,
    setViewingRecruitmentStart,
    SetViewingRecruitmentStart
} from '../../actions';
import { Recruitment } from '../../config/types';

import { StoreState } from '../../reducers';

import Dashboard from '../../views/Dashboard';

const mapStateToProps = ({ recruitment: { recruitments: data, viewing }, user: { info: { isAdmin, isCaptain } } }: StoreState) => ({
    data,
    canLaunch: isCaptain || isAdmin,
    viewing
});

type DispatchType = Dispatch<SetViewingRecruitmentStart | EnqueueSnackbar | LaunchRecruitment>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    setViewing: (title: string) => dispatch(setViewingRecruitmentStart(title)),
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'warning' }) => dispatch(enqueueSnackbar(message, options)),
    launchRecruitment: (info: Partial<Recruitment>) => dispatch(launchRecruitment(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
