import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ChartContainer from '../../component/Chart/ChartContainer';
import { StoreState } from '../../reducer';
import { requestRecruitments } from '../../action/async';

const mapStateToProps = ({ recruitments }: StoreState) => ({
    data: recruitments.recruitments
});

type DispatchType = Dispatch;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    fetchData: () => requestRecruitments()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer);