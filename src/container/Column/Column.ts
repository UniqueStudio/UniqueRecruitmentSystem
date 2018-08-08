import { connect } from 'react-redux';
import { StoreState } from '../../reducer';
import Column from '../../component/Column/Column';
import {
    deselectCandidate,
    DeselectCandidate,
    inputtingComment,
    InupttingComment,
    selectCandidate,
    SelectCandidate,
    toggleFabOff,
    ToggleFabOff,
    toggleModalOff,
    ToggleModalOff,
    toggleModalOn,
    ToggleModalOn,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { Dispatch } from 'redux';
import { removeCandidate, requestResume } from '../../action/async';
import { STEP } from '../../lib/const';

interface OwnProps {
    title: string;
    dropIndex: number;
    isDragging: boolean;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    group: candidates.group,
    isLoading: candidates.isLoading.candidates,
    modalOn: components.modalOn,
    candidates: candidates.candidates[STEP.indexOf(ownProps.title)] || new Map<string, object>(),
    fabOn: components.fabOn,
    snackbarOn: components.snackbar.on
});

type DispatchType =
    Dispatch<SelectCandidate
        | DeselectCandidate
        | ToggleSnackbarOn
        | ToggleModalOn
        | ToggleModalOff
        | InupttingComment
        | ToggleFabOff>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string[]) => dispatch(selectCandidate(name)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    toggleSnakcbarOn: (info: string, color: string = 'info') => dispatch(toggleSnackbarOn(info, color)),
    remove: (cid: string) => removeCandidate(cid)(dispatch),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    toggleModalOff: () => dispatch(toggleModalOff()),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation)),
    toggleFabOff: () => dispatch(toggleFabOff()),
    downloadResume: (cid: string) => requestResume(cid)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);