import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { deselectCandidate, recordInputtingComment, selectCandidate, toggleFabOn } from '../../actions';
import { StoreState } from '../../reducers';

import Card from '../../components/Card';

import { Candidate as CandidateType } from '../../config/types';

interface OwnProps {
    candidate: CandidateType;
    index: number;
    isTeamInterview: boolean;
    toggleDetail: () => void;
}

const mapStateToProps = ({ candidate: { selected }, component: { fabOn } }: StoreState, ownProps: OwnProps) => ({
    checked: selected.includes(ownProps.candidate._id),
    disabled: selected.length !== 0 && fabOn !== ownProps.candidate.step,
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    select: selectCandidate,
    deselect: deselectCandidate,
    changeInputting: recordInputtingComment,
    toggleFabOn,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Card);
