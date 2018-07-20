import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    deselectCandidate,
    DeselectCandidate,
    inputtingComment,
    InupttingComment,
    selectCandidate,
    SelectCandidate,
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

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.comments
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleModalOn | InupttingComment>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation))
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);