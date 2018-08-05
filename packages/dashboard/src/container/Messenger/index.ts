import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { toggleSnackbarOn, ToggleSnackbarOn } from '../../action';
import { sendImage, sendMessage } from '../../action/async';
import Messenger from '../../component/Messenger';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    messages: user.messages,
});

type DispatchType = Dispatch<ToggleSnackbarOn>;

const mapDispatchToProps = (dispatch: DispatchType) => ({
    sendMessage: (message: string) => sendMessage(message)(dispatch),
    sendImage: (image: string) => sendImage(image)(dispatch),
    toggleSnackbar: (message: string, color: string) => dispatch(toggleSnackbarOn(message, color))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);