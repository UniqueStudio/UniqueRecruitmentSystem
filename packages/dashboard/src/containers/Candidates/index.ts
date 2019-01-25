import { OptionsObject } from 'notistack';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

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
} from 'Actions';
import { StoreState } from 'Reducers';

import { Step } from 'Config/types';
import Candidates from 'Views/Candidates';

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
    deselect: (name: string[]) => dispatch(deselectCandidate(name)),
    select: (name: string[]) => dispatch(selectCandidate(name)),
    toggleFabOff: () => dispatch(toggleFabOff()),
    enqueueSnackbar: (message: string, options: OptionsObject = { variant: 'info' }) => dispatch(enqueueSnackbar(message, options)),
    remove: (cid: string) => dispatch(removeCandidateStart(cid)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Candidates);
