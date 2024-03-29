import FaceIcon from '@mui/icons-material/Face';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Chip, Collapse, Divider, IconButton, Paper, TextField } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, {
    ChangeEventHandler,
    ClipboardEventHandler,
    FC,
    KeyboardEventHandler,
    MouseEventHandler,
    useEffect,
    useState,
} from 'react';

import { sendMessage } from '@apis/websocket';
import { EnlargeableImage } from '@components/EnlargeableImg';
import { Status } from '@config/enums';
import { Message } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/messenger';

export const Messenger: FC = observer(() => {
    const { $member, $component } = useStores();
    const classes = useStyles();
    const [content, setContent] = useState('');
    const [container, setContainer] = useState<Element | null>(null);

    useEffect(() => {
        if (container && container.scrollHeight - container.scrollTop < 1000) {
            container.scrollTop = container.scrollHeight;
        }
    }, [$member.messages, container]);

    const generateMessage = (message: string | ArrayBuffer | null, isImage = false) => ({
        content: (message || '').toString(),
        isSelf: true,
        time: Date.now(),
        isImage,
        name: $member.info.name,
        avatar: $member.info.avatar || '',
    });

    const handleKey: KeyboardEventHandler = (event) => {
        const { ctrlKey, charCode } = event;
        if (ctrlKey && charCode === 13) {
            setContent((prevContent) => prevContent + '\n');
        }
        if (!ctrlKey && charCode === 13) {
            event.preventDefault();
            if (/\S+/.exec(content)) {
                send();
            }
        }
    };

    const handlePaste: ClipboardEventHandler = (event) => {
        const items = event.clipboardData.items;
        let blob = null;
        for (const i of Object.values(items)) {
            if (i.type.startsWith('image')) {
                blob = i.getAsFile();
            }
        }
        if (blob !== null) {
            const reader = new FileReader();
            reader.onload = () => {
                sendMessage(generateMessage(reader.result, true));
            };
            reader.readAsDataURL(blob);
        }
    };

    const resetInput: MouseEventHandler<HTMLInputElement> = ({ currentTarget }) => {
        currentTarget.value = '';
    };

    const handleImage: ChangeEventHandler<HTMLInputElement> = ({ target: { files } }) => {
        if (!files) {
            $component.enqueueSnackbar('你没有上传任何图片', Status.info);
            return;
        }
        const file = files[0];
        const extension = file.name.split('.').slice(-1)[0];
        if (!['jpg', 'jpeg', 'png'].includes(extension)) {
            $component.enqueueSnackbar('请上传jpg或png类型的图片', Status.info);
            return;
        }
        if (file.size > 1024 * 1024 * 5) {
            $component.enqueueSnackbar('图片大小必须小于5MB', Status.info);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            sendMessage(generateMessage(reader.result, true));
        };
    };

    const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setContent(value);
    };

    const plusOne = () => {
        if ($member.messages.length) {
            const last = $member.messages[$member.messages.length - 1];
            sendMessage(generateMessage(last.content, last.isImage));
        }
    };

    const send = () => {
        sendMessage(generateMessage(content));
        setContent('');
    };

    const placeHolders = [
        'ctrl + Enter 以输入回车',
        '可以直接发送剪贴板中的图片',
        '+1 可以复读',
        '图片大小必须小于5MB',
        '消息历史最多只有100条',
    ];
    const MessageChip = ({ isSelf, name, time, isImage, content: message }: Message) => (
        <div className={classes.message}>
            <div className={clsx({ [classes.rightAlign]: isSelf })}>
                {`${name} - ${new Date(time).toLocaleTimeString('zh-CN', { hour12: false })}`}
            </div>
            <Divider className={clsx({ [classes.myDivider]: isSelf })} />
            <div className={classes.messageContent}>
                {isImage ? (
                    <EnlargeableImage src={message} />
                ) : (
                    message.split('\n').map((text, index) => (
                        <span key={index}>
                            {text}
                            <br />
                        </span>
                    ))
                )}
            </div>
        </div>
    );
    const AvatarBox = ({ avatar: messageAvatar, name }: Message) => (
        <Avatar alt={name} src={messageAvatar} className={classes.avatar}>
            <FaceIcon />
        </Avatar>
    );
    return (
        <Collapse in={$component.messengerOpen} classes={{ root: classes.collapse }}>
            <Paper className={classes.messenger}>
                <div className={classes.messages} ref={setContainer}>
                    {$member.messages
                        .slice()
                        .reverse()
                        .map((message, index) => (
                            <div
                                key={index}
                                className={clsx(classes.messageContainer, { [classes.my]: message.isSelf })}
                            >
                                {AvatarBox(message)}
                                <Chip
                                    label={MessageChip(message)}
                                    classes={{ root: clsx(classes.chipRoot, { [classes.myChip]: message.isSelf }) }}
                                />
                            </div>
                        ))}
                </div>
                <div className={classes.input}>
                    <Divider />
                    <div className={classes.inputContent}>
                        <input
                            accept='image/png, image/jpeg'
                            className={classes.hidden}
                            id='file'
                            type='file'
                            onChange={handleImage}
                            onClick={resetInput}
                        />
                        <label htmlFor='file'>
                            <IconButton color='primary' component='span'>
                                <InsertPhotoIcon />
                            </IconButton>
                        </label>
                        <IconButton
                            color='primary'
                            component='span'
                            onClick={plusOne}
                            disabled={!$member.messages.length}
                        >
                            <PlusOneIcon />
                        </IconButton>
                        <TextField
                            variant='standard'
                            multiline
                            maxRows={4}
                            value={content}
                            placeholder={placeHolders[~~(Math.random() * placeHolders.length)]}
                            className={classes.textField}
                            margin='normal'
                            onChange={handleChange}
                            onKeyPress={handleKey}
                            onPaste={handlePaste}
                        />
                        <IconButton color='primary' component='span' onClick={send} disabled={!/\S+/.exec(content)}>
                            <SendIcon />
                        </IconButton>
                    </div>
                </div>
            </Paper>
        </Collapse>
    );
});
