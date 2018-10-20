import React, { PureComponent } from 'react';

import classNames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import PlusOneIcon from '@material-ui/icons/ExposurePlus1';
import FaceIcon from '@material-ui/icons/Face';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import RemoveIcon from '@material-ui/icons/Remove';
import SendIcon from '@material-ui/icons/Send';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/massInterview';

import EnlargeableImage from '../EnlargeableImg';

import { Message } from '../../lib/const';
import timeStampToString from '../../lib/timeStampToString';

interface Props extends WithStyles {
    messages: Message[];
    sendMessage: (message: string) => void;
    sendImage: (image: string) => void;
    toggleSnackbar: (message: string, color: string) => void;
}

interface State {
    messages: Message[];
    content: string;
    minimize: boolean;
}

class Messenger extends PureComponent<Props> {

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        const nextLength = nextProps.messages.length;
        const prevLength = prevState.messages.length;
        if (!prevLength) {
            return {
                messages: nextProps.messages,
            };
        }
        const nextLastTime = nextProps.messages[nextLength - 1].time;
        const prevLastTime = prevState.messages[prevLength - 1].time;
        if (nextLastTime !== prevLastTime) {
            return {
                messages: nextProps.messages,
            };
        }
        return null;
    }

    state: State = {
        messages: this.props.messages,
        content: '',
        minimize: true,
    };

    end = document.body as HTMLElement;
    handleKey = (event: React.KeyboardEvent) => {
        if (event.ctrlKey && event.charCode === 13) {
            this.setState({
                content: this.state.content + '\n',
            });
        }
        if (!event.ctrlKey && event.charCode === 13) {
            event.preventDefault();
            if (this.state.content && this.state.content.match(/\S+/)) {
                this.send();
            }
        }
    };

    scrollToBottom = () => {
        this.end.scrollTop = this.end.scrollHeight;
    };
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
                this.props.sendImage(reader.result as string);
            };
            reader.readAsDataURL(blob);
        }
    };
    handleImage = (event: React.ChangeEvent) => {
        const file = event.target['files'][0];
        event.target['value'] = null;
        if (!file) {
            this.props.toggleSnackbar('你没有上传任何图片', 'info');
            return;
        }
        if (!['jpg', 'jpeg', 'png'].includes(file.name.split('.')[-1])) {
            this.props.toggleSnackbar('请上传jpg或png类型的图片', 'info');
            return;
        }
        if (file.size > 1024 * 1024 * 5) {
            this.props.toggleSnackbar('图片大小必须小于5MB', 'info');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.props.sendImage(reader.result as string);
        };
    };
    handleChange = (event: React.ChangeEvent) => {
        this.setState({
            content: event.target['value'],
        });
    };
    plusOne = () => {
        const message = this.state.messages;
        const last = message[message.length - 1];
        if (last) {
            last.type === 'text' ? this.props.sendMessage(last.message) : this.props.sendImage(last.message);
        }
    };

    send = () => {
        this.props.sendMessage(this.state.content);
        this.setState({
            content: '',
        });
    };

    toggleMinimize = () => {
        this.setState({
            minimize: !this.state.minimize,
        });
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        if (this.end.scrollHeight - this.end.scrollTop < 1000) {
            this.scrollToBottom();
        }
    }

    render() {
        const { classes } = this.props;
        const { minimize, messages, content } = this.state;
        const time = (i: number) => timeStampToString(i, -5).split('T')[1];
        return (
            <Paper className={classNames(classes.messenger, minimize && classes.minimize)}>
                <IconButton color='primary' component='span' onClick={this.toggleMinimize}>
                    <RemoveIcon />
                </IconButton>
                <div className={classNames(classes.messages, minimize && classes.minimizeMessages)} ref={(el) => {
                    el && (this.end = el);
                }}>
                    {messages.map((i, j) =>
                        <div key={j}
                             className={classNames(classes.messageContainer, { [classes.my]: i['isSelf'] })}
                        >
                            {i.avatar ? <Avatar
                                alt={i.name}
                                src={i.avatar}
                                className={classes.avatar}
                            /> : <Avatar className={classes.avatar}><FaceIcon /></Avatar>}
                            <Chip
                                label={
                                    <div className={classes.message}>
                                        <div
                                            className={classNames({ [classes.rightAlign]: i.isSelf })}>{`${i.name} - ${time(i.time)}`}</div>
                                        <Divider className={classNames({ [classes.myDivider]: i.isSelf })} />
                                        <div className={classes.messageContent}>
                                            {i.type === 'text'
                                                ? i.message.split('\n').map((k, l) => <span key={l}>{k}<br /></span>)
                                                : <EnlargeableImage src={i.message} />
                                            }
                                        </div>
                                    </div>
                                }
                                classes={{ root: classNames(classes.chipRoot, { [classes.myChip]: i.isSelf }) }}
                            />
                        </div>,
                    )}
                </div>
                <div className={classes.input}>
                    <Divider />
                    <div className={classes.inputContent}>
                        <input accept='image/png, image/jpeg' className={classes.hidden} id='file' type='file'
                               onChange={this.handleImage} />
                        <label htmlFor='file'>
                            <IconButton color='primary' component='span'>
                                <InsertPhotoIcon />
                            </IconButton>
                        </label>
                        <IconButton color='primary' component='span' onClick={this.plusOne}>
                            <PlusOneIcon />
                        </IconButton>
                        <TextField
                            multiline
                            value={content}
                            className={classes.textField}
                            margin='normal'
                            onChange={this.handleChange}
                            onKeyPress={this.handleKey}
                            onPaste={this.handlePaste}
                        />
                        <Tooltip title='ctrl + Enter以输入回车' classes={{ popper: classes.tooltip }}>
                            <IconButton color='primary' component='span' onClick={this.send}
                                        disabled={!Boolean(content && content.match(/\S+/))}>
                                <SendIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </Paper>
        );
    }
}

export default withStyles(styles)(Messenger);
