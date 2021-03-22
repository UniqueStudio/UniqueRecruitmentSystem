import React, { ChangeEventHandler, FC, KeyboardEventHandler, useState } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Chip from '../Chip';

import { Comment, Evaluation } from '../../config/types';

import { observer } from 'mobx-react-lite';
import { addComment, removeComment } from '../../apis/websocket';
import { useStores } from '../../hooks/useStores';
import useStyles from '../../styles/comments';

interface Props {
    cid: string;
    comments: Comment[];
}

const Comments: FC<Props> = observer(({ comments, cid }) => {
    const { $component, $user } = useStores();
    const classes = useStyles();
    const [evaluation, setEvaluation] = useState($component.inputtingComment.evaluation);
    const [content, setContent] = useState($component.inputtingComment.content);

    const handleKey: KeyboardEventHandler = (event) => {
        const { ctrlKey, charCode } = event;
        if (ctrlKey && charCode === 13) {
            setContent((prevContent) => prevContent + '\n');
        }
        if (!ctrlKey && charCode === 13) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const changeEvaluation: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        const newEvaluation = +value as Evaluation;
        setEvaluation(newEvaluation);
        $component.recordInputtingComment(newEvaluation, content);
    };

    const changeContent: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
        setContent(value);
        $component.recordInputtingComment(evaluation, value);
    };

    const handleSubmit = () => {
        if (content && evaluation !== undefined) {
            addComment(cid, {
                uid: $user.info._id,
                content,
                evaluation,
                username: $user.info.username,
            });
            setEvaluation(2);
            setContent('');
        } else {
            $component.enqueueSnackbar('请完整填写评论！', 'warning');
        }
    };

    const handleRemove = (id: string) => () => {
        removeComment(cid, id);
    };

    const handleCopy = (comment: Comment) => () => {
        setEvaluation(comment.evaluation);
        setContent(comment.content);
    };

    return (
        <div className={classes.comments}>
            <div className={classes.evaluation}>
                <TextField select label='评价' value={evaluation} onChange={changeEvaluation}>
                    <MenuItem value={2}>好</MenuItem>
                    <MenuItem value={1}>中</MenuItem>
                    <MenuItem value={0}>差</MenuItem>
                </TextField>
                <TextField
                    label='输入评论'
                    multiline
                    rowsMax={4}
                    className={classes.comment}
                    value={content}
                    onChange={changeContent}
                    onKeyPress={handleKey}
                />
                <Button color='primary' size='large' onClick={handleSubmit}>
                    发表评论
                </Button>
            </div>
            <div>
                <Typography variant='caption' color='textSecondary'>
                    可以发表多个评论，点击自己的评论进行修改
                </Typography>
            </div>
            {comments.map((comment, index) => (
                <Chip
                    comment={comment}
                    key={index}
                    onRemove={$user.info._id === comment.uid ? handleRemove(comment._id) : undefined}
                    onCopy={$user.info._id === comment.uid ? handleCopy(comment) : undefined}
                />
            ))}
        </div>
    );
});

export default Comments;
