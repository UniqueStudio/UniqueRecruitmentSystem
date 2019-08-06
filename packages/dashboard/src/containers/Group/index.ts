import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar } from '../../actions';
import { StoreState } from '../../reducers';

import Group from '../../components/Group';

const mapStateToProps = ({ user: { groupInfo } }: StoreState) => ({
    groupInfo,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    enqueueSnackbar,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Group);
