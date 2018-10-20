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

import { Candidate, STEPS } from '../../lib/const';
import { sortBySlot } from '../../lib/sortBySlot';

interface OwnProps {
    title: string;
    dropIndex: number;
    isDragging: boolean;
    shouldSort: boolean;
}

const mapStateToProps = ({ candidates, components }: StoreState, ownProps: OwnProps) => {
    const candidatesData = candidates.candidates[STEPS.indexOf(ownProps.title)] || new Map<string, Candidate>();
    const cidList = [...candidatesData.keys()];
    const infoList = [...candidatesData.values()];
    return {
        selected: candidates.selected,
        isLoading: candidates.isLoading.candidates,
        modalOn: components.modalOn,
        cidList,
        infoList: ownProps.shouldSort ? infoList.sort(sortBySlot(2)) : infoList,
        ...ownProps,
    };
};

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
