import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import ChartIndex from '../../component/Chart/index';

import {
    getRecruitmentsStart,
    GetRecruitmentsStart,
    launchRecruitment,
    LaunchRecruitment,
    setRecruitment,
    SetRecruitment,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ recruitments, user }: StoreState) => ({
    data: recruitments.recruitments,
    isLoading: recruitments.isLoading,
    canLaunch: user.info['isCaptain'] || user.info['isAdmin'],
    status: recruitments.status,
    userGroup: user.info.group,
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetRecruitmentsStart | LaunchRecruitment | SetRecruitment>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => dispatch(getRecruitmentsStart()),
    toggleSnackbarOn: (info: string, color: string = 'warning') => dispatch(toggleSnackbarOn(info, color)),
    launchRecruitment: (info: object) => dispatch(launchRecruitment(info)),
    setRecruitment: (data: object) => dispatch(setRecruitment(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartIndex);
