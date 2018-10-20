import { DraggableProvided } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
    toggleModalOn,
    ToggleModalOn,
} from '../../action';
import { StoreState } from '../../reducer';

import Candidate from '../../component/Candidate/Candidate';

import { Candidate as CType } from '../../lib/const';

interface OwnProps {
    step: number;
    cid: string;
    info: CType;
    provided: DraggableProvided;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: RouteComponentProps<OwnProps>) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.comments,
    fabOn: components.fabOn,
    ...ownProps,
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleModalOn | RecordInputtingComment | ToggleFabOn>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    changeInputting: (comment: string, evaluation: string) => dispatch(recordInputtingComment(comment, evaluation)),
    toggleFabOn: (step: number) => dispatch(toggleFabOn(step)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Candidate));
