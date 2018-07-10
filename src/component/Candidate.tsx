import * as React from "react";
import {
    Button,
    Card,
    CardHeader,
    Collapse,
    IconButton,
    MenuItem,
    TextField,
    WithStyles,
    withStyles
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

import Comment from "./Comment";
import styles from "../style/style";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
    submit: (step: string, name: string, commenter: string, comment: object) => void;
}

class Candidate extends React.Component<Props> {
    state = {
        expanded: false,
        evaluation: "",
        comment: ""
    };

    handleExpand = () =>
        this.setState(state => ({
            expanded: !this.state.expanded
        }));

    handleChange = (name: string) => (event: React.ChangeEvent) =>
        this.setState({
            [name]: event.target["value"]
        });

    handleSubmit = () => {
        if (this.state.comment && this.state.evaluation) {
            this.props.submit(this.props.step, this.props.name, "AA", {
                comment: this.state.comment,
                evaluation: this.state.evaluation
            });
            // force re-render
            this.setState(state => ({
                evaluation: "",
                comment: "",
            }));
        } else {
            // TODO
        }
    };

    render() {
        const { name, grade, institute, comments, classes } = this.props;
        return (
            <Card
                elevation={0}  
                className={classes.card + ' ' + classes.greyCardWithBorder}
                onClick={this.handleExpand}
            >
                <CardHeader
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={name}
                    subheader={`${grade} - ${institute}`}
                    classes={{ root: classes.cardHeader }}
                />
                <Collapse timeout="auto" unmountOnExit in={this.state.expanded}>
                    <form
                        className={classes.commentContainer}
                        onClick={e => e.stopPropagation()}
                        autoComplete="off"
                    >
                        <TextField
                            id="evaluation"
                            select
                            label="评价"
                            value={this.state.evaluation}
                            onChange={this.handleChange("evaluation")}
                        >
                            {["好", "中", "差"].map(i => (
                                <MenuItem key={i} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="comment"
                            label="输入评论"
                            className={classes.comment}
                            onChange={this.handleChange("comment")}
                            value={this.state.comment}
                            // No need to abstracted as classes, I think.
                            style={{ transform: 'translateY(-1px)' }}
                        />
                        <Button color="primary" size="small" onClick={this.handleSubmit}>
                            发表评论
                        </Button>
                    </form>
                    {Object.entries(comments).map(i => (
                        <Comment name={i[0]} comment={i[1]} key={i[0]} />
                    ))}
                </Collapse>
            </Card>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
