import { Message } from 'Config/types';
import { OptionsObject } from 'notistack';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { enqueueSnackbar, EnqueueSnackbar, sendMessage, SendMessage } from 'Actions';
import { StoreState } from 'Reducers';

import Messenger from 'Components/Messenger';

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
