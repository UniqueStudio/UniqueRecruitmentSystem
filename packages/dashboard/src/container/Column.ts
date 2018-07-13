import { connect } from 'react-redux';
import { StoreState } from '../reducer';
import Column from '../component/Column';
import {
    selectCandidate,
    SelectCandidate,
    deselectCandidate,
    DeselectCandidate,
    removeCandidate,
    RemoveCandidate,
    toggleSnackbarOn,
    ToggleSnackbarOn,
    moveCandidate,
    MoveCandidate,
} from '../action';
import { Dispatch } from 'redux';

interface OwnProps {
    title: string;
}

const mapStateToProps = ({ data }: StoreState, ownProps: OwnProps) => ({
    candidates: data.candidates,
    selected: data.selected,
    group: data.group
});
type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | RemoveCandidate | MoveCandidate | ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: Array<string>) => dispatch(selectCandidate(name)),
    deselect: (name: Array<string>) => dispatch(deselectCandidate(name)),
    remove: (step: string, name: Array<string>) => dispatch(removeCandidate(step, name)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'info')),
    move: (from: string, to: string, uid: string) => dispatch(moveCandidate(from, to, uid))
});
export default connect(mapStateToProps, mapDispatchToProps)(Column);