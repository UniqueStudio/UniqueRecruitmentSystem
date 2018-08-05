import { connect } from 'react-redux';
import Group from '../../component/Group';
import { Dispatch } from 'redux';
import { StoreState } from '../../reducer';
import { requestCandidate } from '../../action/async';

const mapStateToProps = ({ candidates }: StoreState) => ({
    candidates: candidates.candidates || []
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    requestCandidate: (group: string) => requestCandidate(group)(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Group);