import { connect } from 'react-redux';
import { StoreState } from '../../reducer';
import Column from '../../component/Column/Column';
import {
    deselectCandidate,
    DeselectCandidate,
    selectCandidate,
    SelectCandidate,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { Dispatch } from 'redux';
import { moveCandidate, removeCandidate } from '../../action/async';

interface OwnProps {
    title: string;
    candidates: object;
}

const mapStateToProps = ({ candidates }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    group: candidates.group,
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleSnackbarOn>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string[]) => dispatch(selectCandidate(name)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'info')),
    move: (from: number, to: number, cid: string) => moveCandidate(from, to, cid)(dispatch),
    remove: (cid: string) => removeCandidate(cid)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);