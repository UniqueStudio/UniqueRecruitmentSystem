import * as React from "react";
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import CommentChip from "./CommentChip";

import styles from "../../style/index";
import withRoot from "../../style/withRoot";

interface Props extends WithStyles {
    step: number;
    cid: string;
    uid: string;
    username: string;
    comments: object;
    savedComment: {
        comment: string;
        evaluation: string;
    }
    snackbarOn: boolean;
    submit: (step: number, cid: string, commenter: string, comment: object) => void;
    remove: (step: number, cid: string, commenter: string) => void;
    toggleOn: (info: string) => void;
    changeInputting: (comment: string, evaluation: string) => void;
}

class CandidateComments extends React.Component<Props> {
    state = {
        expanded: false,
        evaluation: this.props.savedComment.evaluation,
        comment: this.props.savedComment.comment,
        checked: false,
        anchorEl: undefined,
        modalOpen: false,
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target["value"]
        });
        const comment = name === 'comment' ? event.target["value"] : this.state.comment;
        const evaluation = name === 'evaluation' ? event.target["value"] : this.state.evaluation;
        this.props.changeInputting(comment, evaluation);
    };


    handleSubmit = () => {
        const { comment, evaluation } = this.state;
        const { submit, step, cid, uid, snackbarOn, toggleOn, username } = this.props;
        if (comment && evaluation) {
            submit(step, cid, uid, {
                username,
                comment,
                evaluation
            });
            this.setState({
                evaluation: "",
                comment: "",
            });
        } else {
            if (!snackbarOn) toggleOn('请完整填写评论！');
        }
    };

    handleRemove = () => {
        const { remove, step, cid, uid } = this.props;
        remove(step, cid, uid);
        this.setState({});
    };

    render() {
        const { comments, classes, uid } = this.props;
        return (
            <div className={classes.comments}>
                <div className={classes.cardAction}>
                    <TextField
                        id="evaluation"
                        select
                        label="评价"
                        value={this.state.evaluation}
                        onChange={this.handleChange("evaluation")}
                    >
                        <MenuItem value='good'>
                            好
                        </MenuItem>
                        <MenuItem value='so-so'>
                            中
                        </MenuItem>
                        <MenuItem value='bad'>
                            差
                        </MenuItem>
                    </TextField>
                    <TextField
                        id="comment"
                        label="输入评论"
                        className={classes.comment}
                        onChange={this.handleChange("comment")}
                        value={this.state.comment}
                    />
                    <Button color="primary" size="large" onClick={this.handleSubmit}>
                        发表评论
                    </Button>
                </div>
                {Object.entries(comments).map(i => (
                    <CommentChip name={i[1].username} uid={i[0]} comment={i[1]} key={i[0]} currentUid={uid}
                                 remove={this.handleRemove} />
                ))}
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(CandidateComments));




