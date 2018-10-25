import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Dispatch } from 'redux';

import ColumnContainer from '../../component/Column/ColumnContainer';

import {
    deselectCandidate,
    DeselectCandidate,
    getCandidatesStart,
    GetCandidatesStart,
    moveCandidateStart,
    MoveCandidateStart,
    removeCandidateStart,
    RemoveCandidateStart,
    selectCandidate,
    SelectCandidate,
    toggleFabOff,
    ToggleFabOff,
    toggleSnackbarOn,
    ToggleSnackbarOn,
} from '../../action';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ candidates, components, user, recruitments }: StoreState, ownProps: RouteComponentProps<{}>) => ({
    group: candidates.group,
    selected: candidates.selected,
    fabOn: components.fabOn,
    snackbarOn: components.snackbar.on,
    candidates: candidates.candidates,
    userGroup: user.info.group,
    userJoinTime: user.info.joinTime,
    pendingRecruitment: recruitments.pending,
    ...ownProps,
});

type DispatchType = Dispatch<GetCandidatesStart
    | MoveCandidateStart
    | DeselectCandidate
    | SelectCandidate
    | ToggleFabOff
    | ToggleSnackbarOn
    | RemoveCandidateStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    changeGroup: (group: string, recruitmentName: string) => dispatch(getCandidatesStart(group, recruitmentName)),
    move: (from: number, to: number, cid: string, position: number) => dispatch(moveCandidateStart(from, to, cid, position)),
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    select: (name: string[]) => dispatch(selectCandidate(name)),
    toggleFabOff: () => dispatch(toggleFabOff()),
    toggleSnackbarOn: (info: string, color: string = 'info') => dispatch(toggleSnackbarOn(info, color)),
    remove: (cid: string) => dispatch(removeCandidateStart(cid)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ColumnContainer));
