import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ChartContainer from '../../component/Chart/ChartContainer';
import { StoreState } from '../../reducer';
import {
    getRecruitments,
    GetRecruitments,
    launchRecruitment,
    LaunchRecruitment,
    toggleSnackbarOn,
    ToggleSnackbarOn
} from '../../action';

const mapStateToProps = ({ recruitments, user }: StoreState) => ({
    data: recruitments.recruitments,
    isLoading: recruitments.isLoading,
    canLaunch: user.info['isCaptain'] || user.info['isAdmin'],
    status: recruitments.status
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetRecruitments | LaunchRecruitment>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => dispatch(getRecruitments()),
    toggleSnackbarOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
    launchRecruitment: (info: object) => dispatch(launchRecruitment(info))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer);