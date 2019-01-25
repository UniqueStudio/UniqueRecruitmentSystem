import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import {
    getCandidatesStart,
    GetCandidatesStart,
    getGroupInfoStart,
    GetGroupInfoStart,
    getRecruitmentsStart,
    GetRecruitmentsStart,
    getUserInfoStart,
    GetUserInfoStart,
    toggleDrawerOpen,
    ToggleDrawerOpen
} from 'Actions';
import { StoreState } from 'Reducers';

import Frame from 'Components/Frame';

const mapStateToProps = ({ user, candidate, recruitment, sms, component }: StoreState) => ({
    open: component.drawerOpen,
    loggedIn: Boolean(user.token),
    userInfo: user.info,
    loading: [...Object.values(candidate.isLoading), user.isLoading, recruitment.isLoading, sms.isLoading].includes(true),
    viewingRecruitment: recruitment.viewing
});

type DispatchType = Dispatch<
    | GetUserInfoStart
    | ToggleDrawerOpen
    | GetGroupInfoStart
    | GetRecruitmentsStart
    | GetCandidatesStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawerOpen()),
    getUserInfo: () => dispatch(getUserInfoStart()),
    getRecruitments: () => dispatch(getRecruitmentsStart()),
    getCandidates: (title: string) => dispatch(getCandidatesStart(title)),
    getGroupInfo: () => dispatch(getGroupInfoStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
