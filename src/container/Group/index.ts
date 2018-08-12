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
    submitSlots,
    SubmitSlots,
    toggleSnackbarOn,
    ToggleSnackbarOn
} from '../../action';

const mapStateToProps = ({ candidates, user, recruitments }: StoreState) => ({
    candidates: candidates.candidates || [],
    group: user.group,
    currentRecruitment: recruitments.recruitments.filter(i => i.end > +new Date())[0],
    userInfo: user.info,
    isLoading: candidates.isLoading.candidates
});

type DispatchType = Dispatch<ToggleSnackbarOn | GetGroupInfo | GetCandidates | GetRecruitments | SubmitSlots | SendInterview>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    requestCandidate: (group: string) => dispatch(getCandidates(group)),
    requestGroup: (group: string) => dispatch(getGroupInfo(group)),
    requestRecruitments: () => dispatch(getRecruitments()),
    sendInterview: (content: object) => dispatch(sendInterview(content)),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
    submit: (title: string, slots: number[], group: string) => dispatch(submitSlots(title, slots, group)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);