import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { enqueueSnackbar, sendMessage } from '../../actions';
import { StoreState } from '../../reducers';

import Messenger from '../../components/Messenger';

const mapStateToProps = ({ user: { messages, info: { username, avatar } } }: StoreState) => ({
    messages,
    username,
    avatar,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    sendMessage,
    enqueueSnackbar,
}, dispatch);

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export type Props = StateProps & DispatchProps;
export default connect<StateProps, DispatchProps, {}, StoreState>(mapStateToProps, mapDispatchToProps)(Messenger);
