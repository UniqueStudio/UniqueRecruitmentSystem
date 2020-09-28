import React, { ChangeEventHandler, FC, KeyboardEventHandler, memo, useState } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import Chip from '../Chip';

import { Comment, Evaluation } from '../../config/types';

import { Props } from '../../containers/Comments';

import useStyles from '../../styles/comments';

const Comments: FC<Props> = memo(
    ({ savedComment, comments, uid, changeInputting, submit, cid, enqueueSnackbar, username, remove }) => {
        const classes = useStyles();
        const [evaluation, setEvaluation] = useState(savedComment.evaluation);
        const [content, setContent] = useState(savedComment.content);

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
            changeInputting(content, newEvaluation);
        };

        const changeContent: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
            setContent(value);
            changeInputting(value, evaluation);
        };

        const handleSubmit = () => {
            if (content && evaluation !== undefined) {
                submit(cid, {
                    uid,
                    content,
                    evaluation,
                    username,
                });
                setEvaluation(2);
                setContent('');
            } else {
                enqueueSnackbar('请完整填写评论！', { variant: 'warning' });
            }
        };

        const handleRemove = (id: string) => () => {
            remove(cid, id);
        };

        const handleCopy = (comment: Comment) => () => {
            remove(cid, comment._id);
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
                        onRemove={uid === comment.uid ? handleRemove(comment._id) : undefined}
                        onCopy={uid === comment.uid ? handleCopy(comment) : undefined}
                    />
                ))}
            </div>
        );
    },
);

export default Comments;
