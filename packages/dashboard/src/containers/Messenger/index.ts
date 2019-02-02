import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { OptionsObject } from 'notistack';

import { enqueueSnackbar, EnqueueSnackbar, sendMessage, SendMessage } from '../../actions';
import { Message } from '../../config/types';
import { StoreState } from '../../reducers';

import Messenger from '../../components/Messenger';

const mapStateToProps = ({ user: { messages, info: { username, avatar } } }: StoreState) => ({
    messages,
    username,
    avatar
});

type DispatchType = Dispatch<EnqueueSnackbar | SendMessage>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    sendMessage: (message: Message) => dispatch(sendMessage(message)),
    enqueueSnackbar: (message: string, options?: OptionsObject) => dispatch(enqueueSnackbar(message, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
