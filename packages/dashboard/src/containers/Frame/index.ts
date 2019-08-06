import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { getCandidatesStart, getGroupInfoStart, getRecruitmentsStart, getUserInfoStart, toggleDrawer } from '../../actions';
import { StoreState } from '../../reducers';

import Frame from '../../components/Frame';

const mapStateToProps = ({ user: { token, info }, recruitment: { viewing }, component: { drawerOpen, progressOn } }: StoreState) => ({
    open: drawerOpen,
    loggedIn: Boolean(token),
    userInfo: info,
    loading: progressOn,
    title: viewing,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    toggleOpen: toggleDrawer,
    getUser: getUserInfoStart,
    getGroup: getGroupInfoStart,
    getRecruitments: getRecruitmentsStart,
    getCandidates: getCandidatesStart,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Frame);
