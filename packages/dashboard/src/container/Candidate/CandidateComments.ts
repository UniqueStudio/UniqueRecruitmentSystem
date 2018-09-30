import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
    addCommentStart,
    AddCommentStart,
    recordInputtingComment,
    RecordInputtingComment,
    removeCommentStart,
    RemoveCommentStart,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

import CandidateComments from '../../component/Candidate/CandidateComments';

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
    username: user.info['username'],
    ...ownProps,
});

type DispatchType = Dispatch<ToggleSnackbarOn | RecordInputtingComment | AddCommentStart | RemoveCommentStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (step: number, cid: string, commenter: string, comment: Comment) => dispatch(addCommentStart(step, cid, commenter, comment)),
    remove: (step: number, name: string, commenter: string) => dispatch(removeCommentStart(step, name, commenter)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'warning')),
    changeInputting: (comment: string, evaluation: string) => dispatch(recordInputtingComment(comment, evaluation)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CandidateComments);
