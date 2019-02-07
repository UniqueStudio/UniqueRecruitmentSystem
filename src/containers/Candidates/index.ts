import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import {
    deselectCandidate,
    DeselectCandidate,
    enqueueSnackbar,
    EnqueueSnackbar,
    MoveCandidateStart,
    moveCandidateStart,
    removeCandidateStart,
    RemoveCandidateStart,
    selectCandidate,
    SelectCandidate,
    toggleFabOff,
    ToggleFabOff,
} from '../../actions';
import { StoreState } from '../../reducers';

import { Step } from '../../config/types';
import Candidates from '../../views/Candidates';

const mapStateToProps =
    ({ candidate: { group, selected, candidates, steps }, component: { fabOn }, user: { info } }: StoreState) => ({
        group,
        selected,
        fabOn,
        steps,
        candidates,
        userInfo: info,
    });

type DispatchType =
    Dispatch<MoveCandidateStart
        | DeselectCandidate
        | SelectCandidate
        | ToggleFabOff
        | EnqueueSnackbar
        | RemoveCandidateStart>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    move: (from: Step, to: Step, cid: string, position: number) => dispatch(moveCandidateStart(from, to, cid, position)),
    deselect: (name: string[] | string) => dispatch(deselectCandidate(name)),
    select: (name: string[]) => dispatch(selectCandidate(name)),
    toggleFabOff: () => dispatch(toggleFabOff()),
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'info' }) => dispatch(enqueueSnackbar(message, options)),
    remove: (cid: string) => dispatch(removeCandidateStart(cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidates);
