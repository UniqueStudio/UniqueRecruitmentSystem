import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { deselectCandidate, enqueueSnackbar, removeCandidateStart } from '../../actions';

import { STEPS } from '../../config/consts';
import { Candidate } from '../../config/types';

import { StoreState } from '../../reducers';

import { teamSort } from '../../utils/sortBySlot';

import Candidates from '../../views/Candidates';

const mapStateToProps = ({
    candidate: { group: viewingGroup, selected, candidates, steps },
    component: { fabOn },
}: StoreState) => {
    let candidateInSteps: Candidate[][] = [...new Array(STEPS.length)].map(() => []);
    const selectedInfo: Candidate[] = [];
    if (steps.length !== 2) {
        // 全部面板
        for (const candidate of candidates) {
            if (candidate.group === viewingGroup) {
                candidateInSteps[candidate.step].push(candidate);
            }
            if (selected.includes(candidate._id)) {
                selectedInfo.push(candidate);
            }
        }
    } else {
        // 群面面板
        for (const candidate of candidates) {
            if (candidate.step === steps[0] || candidate.step === steps[1]) {
                // 位于群面或通过
                candidateInSteps[candidate.step].push(candidate);
            }
            if (selected.includes(candidate._id)) {
                selectedInfo.push(candidate);
            }
        }
        candidateInSteps = candidateInSteps.map((toSort) => toSort.sort(teamSort));
    }
    return {
        viewingGroup,
        selectedInfo,
        selected,
        candidates: candidateInSteps,
        steps,
        fabOn,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            deselect: deselectCandidate,
            enqueueSnackbar,
            remove: removeCandidateStart,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Candidates);
