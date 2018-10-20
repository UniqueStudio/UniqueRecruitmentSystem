import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Column from '../../component/Column/Column';

import {
    getResume,
    GetResume,
    recordInputtingComment,
    RecordInputtingComment,
    toggleModalOff,
    ToggleModalOff,
    toggleModalOn,
    ToggleModalOn,
} from '../../action';
import { StoreState } from '../../reducer';

import { STEPS } from '../../lib/const';

interface OwnProps {
    title: string;
    dropIndex: number;
    isDragging: boolean;
    shouldSort: boolean;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => ({
    selected: candidates.selected,
    isLoading: candidates.isLoading.candidates,
    modalOn: components.modalOn,
    candidates: candidates.candidates[STEPS.indexOf(ownProps.title)] || new Map<string, object>(),
    ...ownProps,
});

type DispatchType =
    Dispatch<ToggleModalOn
        | ToggleModalOff
        | RecordInputtingComment
        | GetResume>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleModalOn: (cid: string) => dispatch(toggleModalOn(cid)),
    toggleModalOff: () => dispatch(toggleModalOff()),
    changeInputting: (comment: string, evaluation: string) => dispatch(recordInputtingComment(comment, evaluation)),
    downloadResume: (cid: string) => dispatch(getResume(cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Column);
