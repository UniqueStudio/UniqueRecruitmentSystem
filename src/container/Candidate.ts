import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    addComment,
    AddComment,
    toggleSnackbarOn,
    ToggleSnackbarOn,
    selectCandidate,
    SelectCandidate,
    deselectCandidate,
    DeselectCandidate
} from '../action';
import Candidate from '../component/Candidate';
import { StoreState } from '../reducer';

interface ownProps {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: ownProps) => ({
    selected: candidates['selected']
});

type DispatchType = Dispatch<AddComment | ToggleSnackbarOn | SelectCandidate | DeselectCandidate>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: string, name: string, commenter: string, comment: object) => dispatch(addComment(step, name, commenter, comment)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info)),
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);