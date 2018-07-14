import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    addComment,
    AddComment,
    removeComment,
    RemoveComment,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../action';
import CandidateComments from '../component/Candidate/CandidateComments';
import { StoreState } from '../reducer';

interface OwnProps {
    step: string;
    uid: string;
    comments: object;
}

const mapStateToProps = ({ components }: StoreState, ownProps: OwnProps) => ({
    snackbarOn: components.snackbar.on
});

type DispatchType = Dispatch<AddComment | RemoveComment | ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: string, name: string, commenter: string, comment: object) => dispatch(addComment(step, name, commenter, comment)),
    remove: (step: string, name: string, commenter: string) => dispatch(removeComment(step, name, commenter)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateComments);