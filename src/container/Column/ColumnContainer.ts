import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import { getCandidates, GetCandidates, moveCandidateStart, MoveCandidateStart } from '../../action';

interface OwnProps {
    type: string
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    group: candidates.group,
});

type DispatchType = Dispatch<GetCandidates | MoveCandidateStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => dispatch(getCandidates(group)),
    move: (from: number, to: number, cid: string, position: number) => dispatch(moveCandidateStart(from, to, cid, position)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);