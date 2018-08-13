import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import { moveCandidate } from '../../action/async';
import { getCandidates, GetCandidates } from '../../action';

interface OwnProps {
    type: string
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    group: candidates.group,
});

type DispatchType = Dispatch<GetCandidates>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => dispatch(getCandidates(group)),
    move: (from: number, to: number, cid: string, position: number) => moveCandidate(from, to, cid, position)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);