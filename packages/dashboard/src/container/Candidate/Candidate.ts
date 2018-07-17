import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { deselectCandidate, DeselectCandidate, selectCandidate, SelectCandidate } from '../../action';
import Candidate from '../../component/Candidate/Candidate';
import { StoreState } from '../../reducer';

interface OwnProps {
    step: number;
    cid: string;
    info: object;
    direction: string;
    modalOpen: boolean;
    onNext: () => void;
    onPrev: () => void;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);