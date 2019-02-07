import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { OptionsObject } from 'notistack';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Comment, Evaluation } from '../../config/types';
import styles from '../../styles/candidate';

import Chip from '../Chip';

interface Props extends WithStyles {
    cid: string;
    uid: string;
    username: string;
    comments: Comment[];
    savedComment: State;
    submit: (cid: string, comment: Partial<Comment>) => void;
    remove: (cid: string, id: string) => void;
    enqueueSnackbar: (message: string, options?: OptionsObject) => void;
    changeInputting: (content: string, evaluation: Evaluation) => void;
}

interface State {
    content: string;
    evaluation: Evaluation;
}

class Comments extends PureComponent<Props> {

    state = {
        evaluation: this.props.savedComment.evaluation,
        content: this.props.savedComment.content,
    };

    handleKey = (event: React.KeyboardEvent) => {
        const { ctrlKey, charCode } = event;
        if (ctrlKey && charCode === 13) {
            console.log('aaa');
            this.setState(({ content }: State) => ({
                content: content + '\n',
            }));
        }
        if (!ctrlKey && charCode === 13) {
            event.preventDefault();
            this.handleSubmit();
        }
    };

    handleChange = (name: 'content' | 'evaluation') => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [name]: value,
        });
        const content = name === 'content' ? value : this.state.content;
        const evaluation = name === 'evaluation' ? +value as Evaluation : this.state.evaluation;
        this.props.changeInputting(content, evaluation);
    };

    handleSubmit = () => {
        const { content, evaluation } = this.state;
        const { submit, cid, enqueueSnackbar, uid, username } = this.props;
        if (content && evaluation !== undefined) {
            submit(cid, {
                uid,
                content,
                evaluation,
                username
            });
            this.setState({
                evaluation: 2,
                content: '',
            });
        } else {
            enqueueSnackbar('请完整填写评论！');
        }
    };

    handleRemove = (id: string) => () => {
        const { remove, cid } = this.props;
        remove(cid, id);
    };

    handleCopy = (comment: Comment) => () => {
        const { evaluation, content } = comment;
        this.setState({ evaluation, content });
    };

    render() {
        const { comments, classes, uid } = this.props;
        return (
            <div className={classes.comments}>
                <div className={classes.cardAction}>
                    <TextField
                        select
                        label='评价'
                        value={this.state.evaluation}
                        onChange={this.handleChange('evaluation')}
                    >
                        <MenuItem value={2}>好</MenuItem>
                        <MenuItem value={1}>中</MenuItem>
                        <MenuItem value={0}>差</MenuItem>
                    </TextField>
                    <TextField
                        label='输入评论'
                        className={classes.comment}
                        value={this.state.content}
                        onChange={this.handleChange('content')}
                        onKeyPress={this.handleKey}
                    />
                    <Button color='primary' size='large' onClick={this.handleSubmit}>发表评论</Button>
                </div>
                <Typography variant='caption' color='textSecondary'>可以发表多个评论，点击自己的评论可以复制</Typography>
                {comments.map((comment, index) =>
                    <Chip
                        comment={comment}
                        key={index}
                        onRemove={uid === comment.uid ? this.handleRemove(comment._id) : undefined}
                        onCopy={uid === comment.uid ? this.handleCopy(comment) : undefined}
                    />
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Comments);
