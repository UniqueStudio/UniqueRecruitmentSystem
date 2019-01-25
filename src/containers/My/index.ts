import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import {
    EnqueueSnackbar,
    enqueueSnackbar,
    setUserInfoStart,
    SetUserInfoStart
    // getCandidatesStart,
    // GetCandidatesStart,
    // GetGroupInfoStart,
    // getGroupInfoStart,
    // getRecruitmentsStart,
    // GetRecruitmentsStart,
    // sendInterview,
    // SendInterview,
    // setAllSlotsStart,
    // SetAllSlotsStart,
    // setOneSlotStart,
    // SetOneSlotStart,
} from 'Actions';
import { StoreState } from 'Reducers';

import My from 'Views/My';

const mapStateToProps = ({ /*candidate, */user: { groupInfo, info }/*, recruitments*/ }: StoreState) => ({
    // candidate: candidate.candidate || [],
    groupInfo,
    // currentRecruitment: recruitments.recruitments.filter(({ title }) => title === recruitments.pending)[0],
    userInfo: info,
    // pendingRecruitment: recruitments.pending,
});

type DispatchType =
    Dispatch<EnqueueSnackbar | SetUserInfoStart>;
// | GetGroupInfoStart
// | GetCandidatesStart
// | GetRecruitmentsStart
// | SendInterview
// | SetAllSlotsStart
// | SetOneSlotStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    // requestCandidate: (group: string, recruitmentName: string) => dispatch(getCandidatesStart(group, recruitmentName)),
    // requestGroup: () => dispatch(getGroupInfoStart()),
    // requestRecruitments: () => dispatch(getRecruitmentsStart()),
    // sendInterview: (content: object) => dispatch(sendInterview(content)),
    enqueueSnackbar: (message: string, options?: OptionsObject) => dispatch(enqueueSnackbar(message, options)),
    submitInfo: (info: { phone: string, mail: string }) => dispatch(setUserInfoStart(info)),
    // setAllSlots: (title: string, slots: number[], group: string) => dispatch(setAllSlotsStart(title, slots, group)),
    // setOneSlot: (id: string, time: object) => dispatch(setOneSlotStart(id, time)),
});

export default connect(mapStateToProps, mapDispatchToProps)(My);
