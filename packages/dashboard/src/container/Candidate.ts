import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addComment, AddComment } from '../action';
import Candidate from '../component/Candidate';

interface ownProps {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
}

const mapDispatchToProps = (dispatch: Dispatch<AddComment>, ownProps: ownProps) => ({
    submit: (step: string, name: string, commenter: string, comment: object) => dispatch(addComment(step, name, commenter, comment))
});

export default connect(null, mapDispatchToProps)(Candidate);