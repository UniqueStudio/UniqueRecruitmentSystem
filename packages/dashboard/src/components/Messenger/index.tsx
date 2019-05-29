import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import PlusOneIcon from '@material-ui/icons/ExposurePlus1';
import FaceIcon from '@material-ui/icons/Face';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import SendIcon from '@material-ui/icons/Send';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';
import { OptionsObject } from 'notistack';

import EnlargeableImage from '../EnlargeableImg';

import { Message } from '../../config/types';

import styles from '../../styles/messenger';

interface Props extends WithStyles<typeof styles> {
    messages: Message[];
    username: string;
    avatar: string;
    sendMessage: (message: Message) => void;
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
}

interface State {
    content: string;
}

class Messenger extends PureComponent<Props, State> {

    state = {
        content: ''
    };

    end = document.body;

    handleKey = (event: React.KeyboardEvent) => {
        const { charCode } = event;
        if (charCode === 13) {
            event.preventDefault();
            const { content } = this.state;
            if (content && content.match(/\S+/)) {
                this.send();
            }
        }
    };

    scrollToBottom = () => {
        this.end.scrollTop = this.end.scrollHeight;
    };

    generateMessage = (content: string | ArrayBuffer | null, isImage = false) => ({
        content: (content || '').toString(),
        isSelf: true,
        time: Date.now(),
        isImage,
        name: this.props.username,
        avatar: this.props.avatar,
    });

    handlePaste = (event: React.ClipboardEvent) => {
        const items = (event.clipboardData || event['originalEvent'].clipboardData).items;
        let blob = null;
        for (const i of Object.values(items)) {
            if (i.type.indexOf('image') === 0) {
                blob = i.getAsFile();
            }
        }
        if (blob !== null) {
            const reader = new FileReader();
            reader.onload = () => {
                this.props.sendMessage(this.generateMessage(reader.result, true));
            };
            reader.readAsDataURL(blob);
        }
    };

    resetInput = ({ currentTarget }: React.MouseEvent<HTMLInputElement>) => {
        currentTarget.value = '';
    };

    handleImage = ({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => {
        const { enqueueSnackbar, sendMessage } = this.props;
        if (!files) {
            enqueueSnackbar('你没有上传任何图片', { variant: 'info' });
            return;
        }
        const file = files[0];
        const extension = file.name.split('.').slice(-1)[0];
        if (!['jpg', 'jpeg', 'png'].includes(extension)) {
            enqueueSnackbar('请上传jpg或png类型的图片', { variant: 'info' });
            return;
        }
        if (file.size > 1024 * 1024 * 5) {
            enqueueSnackbar('图片大小必须小于5MB', { variant: 'info' });
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            sendMessage(this.generateMessage(reader.result, true));
        };
    };

    handleChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            content: value,
        });
    };

    plusOne = () => {
        const { messages, sendMessage } = this.props;
        const last = messages[messages.length - 1];
        if (last) {
            sendMessage(this.generateMessage(last.content, last.isImage));
        }
    };

    send = () => {
        this.props.sendMessage(this.generateMessage(this.state.content));
        this.setState({
            content: '',
        });
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        const { scrollHeight, scrollTop } = this.end;
        if (scrollHeight - scrollTop < 1000) {
            this.scrollToBottom();
        }
    }

    render() {
        const { classes, messages } = this.props;
        const { content } = this.state;
        const placeHolders = ['ctrl + Enter 以输入回车', '可以直接发送剪贴板中的图片', '+1 可以复读', '图片大小必须小于5MB', '消息历史最多只有100条'];
        const MessageChip = ({ isSelf, name, time, isImage, content: message }: Message) =>
            <div className={classes.message}>
                <div className={classNames({ [classes.rightAlign]: isSelf })}>
                    {`${name} - ${new Date(time).toLocaleTimeString('zh-CN', { hour12: false })}`}
                </div>
                <Divider className={classNames({ [classes.myDivider]: isSelf })} />
                <div className={classes.messageContent}>
                    {isImage
                        ? <EnlargeableImage src={message} />
                        : message.split('\n').map((text, index) => <span key={index}>{text}<br /></span>)
                    }
                </div>
            </div>;
        const AvatarBox = ({ avatar, name }: Message) =>
            <Avatar alt={name} src={avatar} className={classes.avatar} children={<FaceIcon />} />;
        return (
            <Paper className={classes.messenger}>
                <div
                    className={classes.messages}
                    ref={(el) => el && (this.end = el)}
                >
                    {messages.map((message, index) =>
                        <div
                            key={index}
                            className={classNames(classes.messageContainer, { [classes.my]: message.isSelf })}
                        >
                            {AvatarBox(message)}
                            <Chip
                                label={MessageChip(message)}
                                classes={{ root: classNames(classes.chipRoot, { [classes.myChip]: message.isSelf }) }}
                            />
                        </div>
                    )}
                </div>
                <div className={classes.input}>
                    <Divider />
                    <div className={classes.inputContent}>
                        <input accept='image/png, image/jpeg' className={classes.hidden} id='file' type='file'
                               onChange={this.handleImage} onClick={this.resetInput} />
                        <label htmlFor='file'>
                            <IconButton color='primary' component='span'>
                                <InsertPhotoIcon />
                            </IconButton>
                        </label>
                        <IconButton color='primary' component='span' onClick={this.plusOne} disabled={!messages.length}>
                            <PlusOneIcon />
                        </IconButton>
                        <TextField
                            multiline
                            value={content}
                            placeholder={placeHolders[~~(Math.random() * placeHolders.length)]}
                            className={classes.textField}
                            margin='normal'
                            onChange={this.handleChange}
                            onKeyPress={this.handleKey}
                            onPaste={this.handlePaste}
                        />
                        <IconButton color='primary' component='span' onClick={this.send} disabled={!(content && content.match(/\S+/))}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Messenger);
