import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { addCommentStart, enqueueSnackbar, recordInputtingComment, removeCommentStart } from '../../actions';
import { StoreState } from '../../reducers';

import Comments from '../../components/Comments';

import { Comment } from '../../config/types';

interface OwnProps {
    cid: string;
    comments: Comment[];
}

const mapStateToProps = ({ candidate: { inputtingComment }, user: { info: { _id, username } } }: StoreState, ownProps: OwnProps) => ({
    savedComment: inputtingComment,
    uid: _id,
    username,
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    submit: addCommentStart,
    remove: removeCommentStart,
    enqueueSnackbar,
    changeInputting: recordInputtingComment,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Comments);
