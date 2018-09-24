import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ChartIndex from '../../component/Chart/index';
import { StoreState } from '../../reducer';
import {
    getRecruitments,
    GetRecruitments,
    launchRecruitment,
    LaunchRecruitment,
    postRecruitment,
    PostRecruitment,
    toggleSnackbarOn,
    ToggleSnackbarOn
} from '../../action';

const mapStateToProps = ({ recruitments, user }: StoreState) => ({
    data: recruitments.recruitments,
    isLoading: recruitments.isLoading,
    canLaunch: user.info['isCaptain'] || user.info['isAdmin'],
    status: recruitments.status,
    userGroup: user.info.group
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetRecruitments | LaunchRecruitment | PostRecruitment>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => dispatch(getRecruitments()),
    toggleSnackbarOn: (info: string, color: string = 'warning') => dispatch(toggleSnackbarOn(info, color)),
    launchRecruitment: (info: object) => dispatch(launchRecruitment(info)),
    submitRecruitment: (data: object) => dispatch(postRecruitment(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartIndex);