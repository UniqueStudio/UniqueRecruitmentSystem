import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { recordInputtingComment } from '../../actions';
import { StoreState } from '../../reducers';

import Slider from '../../components/Slider';

import { Candidate } from '../../config/types';

interface OwnProps {
    index: number;
    candidate: Candidate;
    handlePrev: (index: number) => void;
    handleNext: (index: number) => void;
    handleTodo: () => void;
}

const mapStateToProps = (state: StoreState, ownProps: OwnProps) => ({
    ...ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    changeInputting: recordInputtingComment,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type ConnectedProps = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, OwnProps, StoreState>(mapStateToProps, mapDispatchToProps)(Slider);
