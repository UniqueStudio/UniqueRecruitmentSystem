import { connect } from 'react-redux';
import Group from '../../component/Group';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { requestCandidate, requestGroup, requestRecruitments, submitSlots } from '../../action/async';
import { toggleSnackbarOn } from '../../action';

const mapStateToProps = ({ candidates, user, recruitments }: StoreState) => ({
    candidates: candidates.candidates || [],
    group: user.group,
    currentRecruitment: recruitments.recruitments.filter(i => i.end > +new Date())[0],
    userInfo: user.info,
    isLoading: candidates.isLoading.candidates
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestCandidate: (group: string) => requestCandidate(group)(dispatch),
    requestGroup: (group: string) => requestGroup(group)(dispatch),
    requestRecruitments: () => requestRecruitments()(dispatch),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
    submit: (title: string, slots: number[], group: string) => submitSlots(title, slots, group)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);