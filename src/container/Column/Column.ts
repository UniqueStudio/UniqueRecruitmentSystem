import { connect } from 'react-redux';
import { StoreState } from '../../reducer';
import Column from '../../component/Column/Column';
import {
    getResume,
    GetResume,
    inputtingComment,
    InputtingComment,
    toggleModalOff,
    ToggleModalOff,
    toggleModalOn,
    ToggleModalOn,
} from '../../action';
import { Dispatch } from 'redux';
import { STEP } from '../../lib/const';

interface OwnProps {
    title: string;
    dropIndex: number;
    isDragging: boolean;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.candidates,
    modalOn: components.modalOn,
    candidates: candidates.candidates[STEP.indexOf(ownProps.title)] || new Map<string, object>(),
});

type DispatchType =
    Dispatch<ToggleModalOn
        | ToggleModalOff
        | InputtingComment
        | GetResume>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    toggleModalOff: () => dispatch(toggleModalOff()),
    changeInputting: (comment: string, evaluation: string) => dispatch(inputtingComment(comment, evaluation)),
    downloadResume: (cid: string) => dispatch(getResume(cid))
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);