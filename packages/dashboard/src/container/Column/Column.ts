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
    toggleModalOff,
    ToggleModalOff,
    toggleModalOn,
    ToggleModalOn,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { Dispatch } from 'redux';
import { removeCandidate } from '../../action/async';
import { STEP } from '../../lib/const';

interface OwnProps {
    title: string;
    dropIndex: number;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    group: candidates.group,
    isLoading: candidates.isLoading.candidates,
    modalOn: components.modalOn,
    candidates: candidates.candidates[STEP.indexOf(ownProps.title)] || {}
});

type DispatchType = Dispatch<SelectCandidate | DeselectCandidate | ToggleSnackbarOn | ToggleModalOn | ToggleModalOff | InupttingComment>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    select: (name: string[]) => dispatch(selectCandidate(name)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    toggleOn: (info: string) => dispatch(toggleSnackbarOn(info, 'info')),
    remove: (cid: string) => removeCandidate(cid)(dispatch),
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    toggleModalOff: () => dispatch(toggleModalOff()),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation))
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);