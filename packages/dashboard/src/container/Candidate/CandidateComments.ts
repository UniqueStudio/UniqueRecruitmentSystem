import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    addCommentStart,
    AddCommentStart,
    inputtingComment,
    InputtingComment,
    removeCommentStart,
    RemoveCommentStart,
    toggleSnackbarOn,
    ToggleSnackbarOn
} from '../../action';
import CandidateComments from '../../component/Candidate/CandidateComments';
import { StoreState } from '../../reducer';
import { Comment } from '../../lib/const';

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

type DispatchType = Dispatch<ToggleSnackbarOn | InputtingComment | AddCommentStart | RemoveCommentStart>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: number, cid: string, commenter: string, comment: Comment) => dispatch(addCommentStart(step, cid, commenter, comment)),
    remove: (step: number, name: string, commenter: string) => dispatch(removeCommentStart(step, name, commenter)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation))
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateComments);