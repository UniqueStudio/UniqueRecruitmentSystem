import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    addComment,
    AddComment,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../action';
import CandidateComments from '../component/Candidate/CandidateComments';
import { StoreState } from '../reducer';

interface OwnProps {
    step: string;
    name: string;
    comments: object;
}

const mapStateToProps = ({ components }: StoreState, ownProps: OwnProps) => ({
    snackbarOn: components.snackbar.on
});

type DispatchType = Dispatch<AddComment | ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: string, name: string, commenter: string, comment: object) => dispatch(addComment(step, name, commenter, comment)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateComments);