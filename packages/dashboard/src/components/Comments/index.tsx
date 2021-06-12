import { Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, KeyboardEventHandler, useState } from 'react';

import { addComment, removeComment } from '@apis/websocket';
import { Chip } from '@components/Chip';
import { Evaluation } from '@config/enums';
import { Application, Comment } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/comments';

interface Props {
    application: Application;
}

export const Comments: FC<Props> = observer(({ application: { comments, id } }) => {
    const { $component, $member } = useStores();
    const classes = useStyles();
    const [evaluation, setEvaluation] = useState($component.inputtingComment.evaluation);
    const [content, setContent] = useState($component.inputtingComment.content);

    const handleKey: KeyboardEventHandler = (event) => {
        const { ctrlKey, key } = event;
        if (ctrlKey && key === 'Enter') {
            setContent((prevContent) => prevContent + '\n');
        }
        if (!ctrlKey && key === 'Enter') {
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
        if (content) {
            addComment(id, {
                content,
                evaluation,
            });
            setEvaluation(Evaluation.fair);
            setContent('');
        } else {
            $component.enqueueSnackbar('请完整填写评论', 'warning');
        }
    };

    const handleRemove = (id: string) => () => {
        removeComment(id);
    };

    const handleCopy = (comment: Comment) => () => {
        setEvaluation(comment.evaluation);
        setContent(comment.content);
    };

    return (
        <div>
            <div className={classes.evaluation}>
                <TextField
                    variant='standard'
                    select
                    label='评价'
                    margin='normal'
                    value={evaluation}
                    onChange={changeEvaluation}
                >
                    <MenuItem value={2}>👍</MenuItem>
                    <MenuItem value={1}>🤔</MenuItem>
                    <MenuItem value={0}>👎</MenuItem>
                </TextField>
                <TextField
                    variant='standard'
                    label='输入评论'
                    margin='normal'
                    multiline
                    maxRows={3}
                    className={classes.comment}
                    value={content}
                    onChange={changeContent}
                    onKeyPress={handleKey}
                />
                <Button size='large' onClick={handleSubmit}>
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
                    onRemove={$member.info.id === comment.member.id ? handleRemove(comment.id) : undefined}
                    onCopy={$member.info.id === comment.member.id ? handleCopy(comment) : undefined}
                />
            ))}
        </div>
    );
});
