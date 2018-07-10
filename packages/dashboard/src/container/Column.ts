import { connect } from 'react-redux';
import { StoreState } from '../reducer';
import Column from '../component/Column';
import { selectCandidate, SelectCandidate, deselectCandidate, DeselectCandidate, removeCandidate, RemoveCandidate } from '../action';
import { Dispatch } from 'redux';

interface ownProps {
    title: string;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: ownProps) => ({
    candidates
});
type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | RemoveCandidate>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: Array<string>) => dispatch(selectCandidate(name)),
    deselect: (name: Array<string>) => dispatch(deselectCandidate(name)),
    remove: (step: string, name: Array<string>) => dispatch(removeCandidate(step, name)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Column);