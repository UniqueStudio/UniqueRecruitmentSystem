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
    toggleDrawer,
    ToggleDrawer
} from '../../actions';
import { StoreState } from '../../reducers';

import Frame from '../../components/Frame';

const mapStateToProps = ({ user: { token, info }, recruitment: { viewing }, component: { drawerOpen, progressOn } }: StoreState) => ({
    open: drawerOpen,
    loggedIn: Boolean(token),
    userInfo: info,
    loading: progressOn,
    viewingRecruitment: viewing
});

type DispatchType = Dispatch<| GetUserInfoStart
    | ToggleDrawer
    | GetGroupInfoStart
    | GetRecruitmentsStart
    | GetCandidatesStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    toggleOpen: () => dispatch(toggleDrawer()),
    getUserInfo: () => dispatch(getUserInfoStart()),
    getRecruitments: () => dispatch(getRecruitmentsStart()),
    getCandidates: (title: string) => dispatch(getCandidatesStart(title)),
    getGroupInfo: () => dispatch(getGroupInfoStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
