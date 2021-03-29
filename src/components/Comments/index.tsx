import { Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, KeyboardEventHandler, useState } from 'react';

import { addComment, removeComment } from '@apis/websocket';
import { Chip } from '@components/Chip';
import { Evaluation } from '@config/enums';
import { Comment } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/comments';

interface Props {
    cid: string;
    comments: Comment[];
}

export const Comments: FC<Props> = observer(({ comments, cid }) => {
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
                content,
                evaluation,
            });
            setEvaluation(2);
            setContent('');
        } else {
            $component.enqueueSnackbar('请完整填写评论', 'warning');
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
                    onRemove={$user.info.id === comment.user.id ? handleRemove(comment.id) : undefined}
                    onCopy={$user.info.id === comment.user.id ? handleCopy(comment) : undefined}
                />
            ))}
        </div>
    );
});
