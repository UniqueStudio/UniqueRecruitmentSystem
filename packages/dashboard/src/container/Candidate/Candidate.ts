import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    deselectCandidate,
    DeselectCandidate,
    inputtingComment,
    InputtingComment,
    selectCandidate,
    SelectCandidate,
    toggleFabOn,
    ToggleFabOn,
    toggleModalOn,
    ToggleModalOn
} from '../../action';
import { DraggableProvided } from 'react-beautiful-dnd';
import Candidate from '../../component/Candidate/Candidate';
import { StoreState } from '../../reducer';

interface OwnProps {
    step: number;
    cid: string;
    info: object;
    provided: DraggableProvided
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.comments,
    fabOn: components.fabOn
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleModalOn | InputtingComment | ToggleFabOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation)),
    toggleFabOn: (step: number) => dispatch(toggleFabOn(step))
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);