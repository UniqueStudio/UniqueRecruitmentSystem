import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { sendImage, sendMessage } from '../../action/async';
import Messenger from '../../component/Messenger';
import { StoreState } from '../../reducer';

const mapStateToProps = ({ user }: StoreState) => ({
    messages: user.messages,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    sendMessage: (message: string) => sendMessage(message)(dispatch),
    sendImage: (image: string) => sendImage(image)(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messenger);