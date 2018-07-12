import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
    selectCandidate,
    SelectCandidate,
    deselectCandidate,
    DeselectCandidate
} from '../action';
import Candidate from '../component/Candidate/Candidate';
import { StoreState } from '../reducer';

interface OwnProps {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
}

const mapStateToProps = ({ data }: StoreState, ownProps: OwnProps) => ({
    selected: data['selected'],
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string) => dispatch(selectCandidate(name)),
    deselect: (name: string) => dispatch(deselectCandidate(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);