import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    deselectCandidate,
    DeselectCandidate,
    selectCandidate,
    SelectCandidate,
    toggleModalOn,
    ToggleModalOn
} from '../../action';
import Candidate from '../../component/Candidate/Candidate';
import { StoreState } from '../../reducer';

interface OwnProps {
    step: number;
    cid: string;
    info: object;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.comments
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleModalOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid))
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);