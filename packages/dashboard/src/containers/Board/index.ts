import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { moveCandidateStart } from '../../actions';

import Board from '../../components/Board';
import { Candidate } from '../../config/types';
import { StoreState } from '../../reducers';

interface OwnProps {
    candidates: Candidate[][];
    toggleDetail: (detail: number) => (index: number) => () => void;
}

const mapStateToProps =
    ({ candidate: { steps } }: StoreState, ownProps: OwnProps) => ({
        steps,
        ...ownProps
    });

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    move: moveCandidateStart
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Board);
