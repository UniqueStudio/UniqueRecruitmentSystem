import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { sendImage, SendImage, sendMessage, SendMessage, toggleSnackbarOn, ToggleSnackbarOn } from '../../action';
import { StoreState } from '../../reducer';

import Messenger from '../../component/Messenger';

const mapStateToProps = ({ user }: StoreState) => ({
    messages: user.messages,
});

type DispatchType = Dispatch<ToggleSnackbarOn | SendImage | SendMessage>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    sendMessage: (message: string) => dispatch(sendMessage(message)),
    sendImage: (image: string) => dispatch(sendImage(image)),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);
