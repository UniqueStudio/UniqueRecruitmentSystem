import { connect } from 'react-redux';
import Group from '../../component/Group';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import {
    getCandidates,
    GetCandidates,
    getGroupInfo,
    GetGroupInfo,
    getRecruitments,
    GetRecruitments,
    sendInterview,
    SendInterview,
    SetCandidateSlot,
    setCandidateSlot,
    submitSlots,
    SubmitSlots,
    toggleSnackbarOn,
    ToggleSnackbarOn
} from '../../action';
import { PENDING_RECRUITMENT } from "../../lib/const";

const mapStateToProps = ({ candidates, user, recruitments }: StoreState) => ({
    candidates: candidates.candidates || [],
    group: user.group,
    currentRecruitment: recruitments.recruitments.filter(i => i.title === PENDING_RECRUITMENT)[0],
    userGroup: user.info.group,
    isLoading: candidates.isLoading.candidates
});

type DispatchType =
    Dispatch<ToggleSnackbarOn
        | GetGroupInfo
        | GetCandidates
        | GetRecruitments
        | SubmitSlots
        | SendInterview
        | SetCandidateSlot>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    requestCandidate: (group: string) => dispatch(getCandidates(group)),
    requestGroup: (group: string) => dispatch(getGroupInfo(group)),
    requestRecruitments: () => dispatch(getRecruitments()),
    sendInterview: (content: object) => dispatch(sendInterview(content)),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
    submit: (title: string, slots: number[], group: string) => dispatch(submitSlots(title, slots, group)),
    setCandidateSlot: (id: string, time: object) => dispatch(setCandidateSlot(id, time))
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);