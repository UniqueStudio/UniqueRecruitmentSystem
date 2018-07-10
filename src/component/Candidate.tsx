import * as React from "react";
import {
    Button,
    Checkbox,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    MenuItem,
    TextField,
    Typography,
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
    selected: Array<string>;
    submit: (step: string, name: string, commenter: string, comment: object) => void;
    toggleOn: (info: string) => void;
    select: (name: string) => void;
    deselect: (name: string) => void;
}

class Candidate extends React.Component<Props> {
    state = {
        expanded: false,
        evaluation: "",
        comment: "",
        checked: false,
    };

    handleChange = (name: string) => (event: React.ChangeEvent) =>
        this.setState({
            [name]: event.target["value"]
        });

    handleCheck = (event: React.ChangeEvent) => {
        this.setState({
            checked: event.target['checked']
        });
        event.target['checked'] ? this.props.select(this.props.name) : this.props.deselect(this.props.name);
    };

    handleSubmit = () => {
        if (this.state.comment && this.state.evaluation) {
            this.props.submit(this.props.step, this.props.name, "AA", {
                comment: this.state.comment,
                evaluation: this.state.evaluation
            });
            this.setState({
                evaluation: "",
                comment: "",
            });
        } else {
            this.props.toggleOn('请完整填写评论！');
        }
    };

    render() {
        const { name, grade, institute, comments, selected, classes } = this.props;
        return (
                <ExpansionPanel className={classes.card}>
                    <ExpansionPanelSummary>
                        <Checkbox checked={selected.includes(name)}
                                  onChange={this.handleCheck}
                                  onClick={e => e.stopPropagation()}
                                  color='primary'
                                  classes={{ root: classes.cornerChecker }}
                        />
                        <span>
                        <Typography variant='title'>{name}</Typography>
                        <Typography color='textSecondary'>{`${grade} - ${institute}`}</Typography>
                    </span>
                        <IconButton className={classes.iconButton}>
                            <MoreVertIcon />
                        </IconButton>
                        {/* this div is used to get avoid of default style on :last-child */}
                        <div style={{ position: 'absolute' }} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelActions>
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
                        />
                        <Button color="primary" size="small" onClick={this.handleSubmit}>
                            发表评论
                        </Button>
                    </ExpansionPanelActions>
                    <ExpansionPanelDetails className={classes.cardDetail}>
                        {Object.entries(comments).map(i => (
                            <Comment name={i[0]} comment={i[1]} key={i[0]} />
                        ))}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
