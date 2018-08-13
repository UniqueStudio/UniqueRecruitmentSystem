import { connect } from 'react-redux';
import Group from '../../component/Group';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { requestRecruitments, sendInterview, submitSlots } from '../../action/async';
import {
    getCandidates,
    GetCandidates,
    getGroupInfo,
    GetGroupInfo,
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

type DispatchType = Dispatch<ToggleSnackbarOn | GetGroupInfo | GetCandidates>

const mapDispatchToProps = (dispatch: DispatchType) => ({
    requestCandidate: (group: string) => dispatch(getCandidates(group)),
    requestGroup: (group: string) => dispatch(getGroupInfo(group)),
    requestRecruitments: () => requestRecruitments()(dispatch),
    sendInterview: (content: object) => sendInterview(content)(dispatch),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
    submit: (title: string, slots: number[], group: string) => submitSlots(title, slots, group)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);