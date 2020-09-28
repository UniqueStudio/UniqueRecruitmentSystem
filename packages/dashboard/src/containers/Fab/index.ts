import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { deselectCandidate, selectCandidate, toggleFabOff } from '../../actions';
import Fab from '../../components/Fab';
import { Candidate } from '../../config/types';
import { StoreState } from '../../reducers';

interface OwnProps {
    candidates: Candidate[];
    toggleOpen: (component: string) => () => void;
}

const mapStateToProps = (
    {
        candidate: { group, selected, steps },
        component: { fabOn },
        user: {
            info: { isAdmin, isCaptain, group: userGroup },
        },
    }: StoreState,
    ownProps: OwnProps,
) => ({
    group,
    selected,
    fabOn,
    steps,
    canOperate: isAdmin || (steps.length === 2 ? isCaptain : group === userGroup),
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            deselect: deselectCandidate,
            select: selectCandidate,
            toggleFabOff,
        },
        dispatch,
    );

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Fab);
