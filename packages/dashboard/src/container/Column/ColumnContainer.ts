import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import { moveCandidate, requestCandidate } from '../../action/async';

interface OwnProps {
    type: string
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    group: candidates.group,
});

type DispatchType = Dispatch;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => requestCandidate(group)(dispatch),
    move: (from: number, to: number, cid: string, position: number) => moveCandidate(from, to, cid, position)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);