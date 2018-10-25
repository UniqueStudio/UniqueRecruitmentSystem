import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Group from '../../component/Group';

import {
    getCandidatesStart,
    GetCandidatesStart,
    getGroupInfoStart,
    GetGroupInfoStart,
    getRecruitmentsStart,
    GetRecruitmentsStart,
    sendInterview,
    SendInterview,
    setAllSlotsStart,
    SetAllSlotsStart,
    setOneSlotStart,
    SetOneSlotStart,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ candidates, user, recruitments }: StoreState) => ({
    candidates: candidates.candidates || [],
    group: user.group,
    currentRecruitment: recruitments.recruitments.filter(({ title }) => title === recruitments.pending)[0],
    userGroup: user.info.group,
    isLoading: candidates.isLoading.candidates,
    pendingRecruitment: recruitments.pending,
});

type DispatchType =
    Dispatch<ToggleSnackbarOn
        | GetGroupInfoStart
        | GetCandidatesStart
        | GetRecruitmentsStart
        | SendInterview
        | SetAllSlotsStart
        | SetOneSlotStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    requestCandidate: (group: string, recruitmentName: string) => dispatch(getCandidatesStart(group, recruitmentName)),
    requestGroup: (group: string) => dispatch(getGroupInfoStart(group)),
    requestRecruitments: () => dispatch(getRecruitmentsStart()),
    sendInterview: (content: object) => dispatch(sendInterview(content)),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
    setAllSlots: (title: string, slots: number[], group: string) => dispatch(setAllSlotsStart(title, slots, group)),
    setOneSlot: (id: string, time: object) => dispatch(setOneSlotStart(id, time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);
