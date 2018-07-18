import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import { requestCandidate } from '../../action/async';

const mapStateToProps = ({ routerReducer, candidates }: StoreState) => ({
    pathname: (routerReducer.location || { pathname: '' }).pathname,
    candidates: candidates.candidates,
});

type DispatchType = Dispatch;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => requestCandidate(group)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);