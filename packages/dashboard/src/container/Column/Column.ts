import { connect } from 'react-redux';
import { StoreState } from '../../reducer';
import Column from '../../component/Column/Column';
import {
    deselectCandidate,
    DeselectCandidate,
    moveCandidate,
    MoveCandidate,
    selectCandidate,
    SelectCandidate,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { Dispatch } from 'redux';

interface OwnProps {
    title: string;
    candidates: object;
}

const mapStateToProps = ({ data }: StoreState, ownProps: OwnProps) => ({
    selected: data.selected,
    group: data.group,
    isLoading: data.isLoading
});
type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | MoveCandidate | ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string[]) => dispatch(selectCandidate(name)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'info')),
    move: (from: number, to: number, cid: string) => dispatch(moveCandidate(from, to, cid)),
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Column);