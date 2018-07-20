import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import { moveCandidate, requestCandidate } from '../../action/async';

const mapStateToProps = ({ routerReducer }: StoreState) => ({
    pathname: (routerReducer.location || { pathname: '' }).pathname,
});

type DispatchType = Dispatch;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => requestCandidate(group)(dispatch),
    move: (from: number, to: number, cid: string) => moveCandidate(from, to, cid)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);