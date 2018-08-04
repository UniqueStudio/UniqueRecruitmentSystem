import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { inputtingComment, InupttingComment, toggleSnackbarOn, ToggleSnackbarOn } from '../../action';
import { addComment, removeComment } from '../../action/async';
import CandidateComments from '../../component/Candidate/CandidateComments';
import { StoreState } from '../../reducer';

interface OwnProps {
    step: number;
    cid: string;
    comments: object;
}

const mapStateToProps = ({ components, candidates, user }: StoreState, ownProps: OwnProps) => ({
    snackbarOn: components.snackbar.on,
    isLoading: candidates.isLoading.comments,
    savedComment: candidates.inputtingComment,
    uid: user.uid,
    username: user.info['username']
});

type DispatchType = Dispatch<ToggleSnackbarOn | InupttingComment>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: number, cid: string, commenter: string, comment: object) => addComment(step, cid, commenter, comment)(dispatch),
    remove: (step: number, name: string, commenter: string) => removeComment(step, name, commenter)(dispatch),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation))
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateComments);