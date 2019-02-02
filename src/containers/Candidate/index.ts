import { DraggableProvided } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
    deselectCandidate,
    DeselectCandidate,
    recordInputtingComment,
    RecordInputtingComment,
    selectCandidate,
    SelectCandidate,
    toggleFabOn,
    ToggleFabOn,
} from '../../actions';
import { StoreState } from '../../reducers';

import Candidate from '../../components/Candidate';

import { Candidate as CandidateType, Evaluation } from '../../config/types';

interface OwnProps {
    candidate: CandidateType;
    provided: DraggableProvided;
    isTeamInterview: boolean;
    selected: string[];
    toggleDetail: () => void;
}

const mapStateToProps = ({ component: { fabOn } }: StoreState, ownProps: OwnProps) => ({
    fabOn,
    ...ownProps,
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | RecordInputtingComment | ToggleFabOn>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
    changeInputting: (content: string, evaluation: Evaluation) => dispatch(recordInputtingComment(content, evaluation)),
    toggleFabOn: (step: number) => dispatch(toggleFabOn(step)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);
