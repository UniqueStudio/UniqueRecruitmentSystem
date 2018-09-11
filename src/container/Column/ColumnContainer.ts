import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ColumnContainer from '../../component/Column/ColumnContainer';
import { StoreState } from '../../reducer';
import {
    deselectCandidate,
    DeselectCandidate,
    getCandidates,
    GetCandidates,
    moveCandidateStart,
    MoveCandidateStart,
    removeCandidateStart,
    RemoveCandidateStart,
    selectCandidate,
    SelectCandidate,
    toggleFabOff,
    ToggleFabOff,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';

interface OwnProps {
    type: string
}

const mapStateToProps = ({ candidates, components, user }: StoreState, ownProps: OwnProps) => ({
    group: candidates.group,
    selected: candidates.selected,
    fabOn: components.fabOn,
    snackbarOn: components.snackbar.on,
    candidates: candidates.candidates,
    userGroup: user.info.group
});

type DispatchType = Dispatch<GetCandidates | MoveCandidateStart | DeselectCandidate | SelectCandidate | ToggleFabOff | ToggleSnackbarOn | RemoveCandidateStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string) => dispatch(getCandidates(group)),
    move: (from: number, to: number, cid: string, position: number) => dispatch(moveCandidateStart(from, to, cid, position)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    select: (name: string[]) => dispatch(selectCandidate(name)),
    toggleFabOff: () => dispatch(toggleFabOff()),
    toggleSnakcbarOn: (info: string, color: string = 'info') => dispatch(toggleSnackbarOn(info, color)),
    remove: (cid: string) => dispatch(removeCandidateStart(cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnContainer);