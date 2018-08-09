import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ChartContainer from '../../component/Chart/ChartContainer';
import { StoreState } from '../../reducer';
import { launchRecruitment, requestRecruitments } from '../../action/async';
import { ToggleSnackbarOn, toggleSnackbarOn } from '../../action';

const mapStateToProps = ({ recruitments, user }: StoreState) => ({
    data: recruitments.recruitments,
    isLoading: recruitments.isLoading,
    canLaunch: user.info['isCaptain'] || user.info['isAdmin'],
    status: recruitments.status
});

type DispatchType = Dispatch<ToggleSnackbarOn>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => requestRecruitments()(dispatch),
    toggleSnackbarOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
    launchRecruitment: (info: object) => launchRecruitment(info)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer);