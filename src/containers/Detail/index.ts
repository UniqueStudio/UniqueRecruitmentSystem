import { OptionsObject } from 'notistack';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
    addCommentStart,
    AddCommentStart,
    enqueueSnackbar,
    EnqueueSnackbar,
    getResume,
    GetResume,
    recordInputtingComment,
    RecordInputtingComment,
    removeCommentStart,
    RemoveCommentStart
} from '../../actions';
import { StoreState } from '../../reducers';

import Detail from '../../components/Detail';

import { Candidate, Comment, Evaluation } from '../../config/types';

interface OwnProps {
    candidate: Candidate;
    handlePrev: (index: number) => void;
    handleNext: (index: number) => void;
}

const mapStateToProps = ({ candidate: { inputtingComment }, user: { info }, component: { resumeProgress } }: StoreState, ownProps: OwnProps) => ({
    savedComment: inputtingComment,
    user: info,
    progress: resumeProgress,
    ...ownProps,
});

type DispatchType = Dispatch<EnqueueSnackbar | RecordInputtingComment | AddCommentStart | RemoveCommentStart | GetResume>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    submit: (cid: string, comment: Partial<Comment>) => dispatch(addCommentStart(cid, comment)),
    remove: (name: string, id: string) => dispatch(removeCommentStart(name, id)),
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'warning' }) => dispatch(enqueueSnackbar(message, options)),
    changeInputting: (content: string, evaluation: Evaluation) => dispatch(recordInputtingComment(content, evaluation)),
    getResume: (cid: string) => dispatch(getResume(cid))
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
