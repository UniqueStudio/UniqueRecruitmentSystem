import * as React from "react";
import {
    Button,
    Checkbox,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";

import Comment from "./Comment";
import Modal from './Modal';
import styles from "../style/style";
import { warningColor, dangerColor, successColor, colortToAlpha } from '../style/style';
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    step: string;
    name: string;
    grade: string;
    institute: string;
    comments: object;
    snackbarOn: boolean;
    selected: string[];
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
        anchorEl: undefined,
        modalOpen: false,
    };

    handleMenuOpen = (event: React.MouseEvent) => {
        event.stopPropagation();
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = (event: React.MouseEvent) => {
        event.stopPropagation();
        this.setState({ anchorEl: undefined });
    };

    toggleModalOpen = (event: React.MouseEvent) => {
        event.stopPropagation();
        this.setState({ modalOpen: !this.state.modalOpen });
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
        const { comment, evaluation } = this.state;
        const { submit, step, name, snackbarOn, toggleOn } = this.props;
        if (comment && evaluation) {
            submit(step, name, "AA", {
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

    render() {
        const { name, grade, institute, comments, selected, classes } = this.props;
        const evaluations = Object.values(comments).map(i => i['evaluation']);
        const red = colortToAlpha(dangerColor, 0.1),
            yellow = colortToAlpha(warningColor, 0.1),
            green = colortToAlpha(successColor, 0.1);
        const yellowP = evaluations.filter(i => i === '中').length / evaluations.length * 100,
            greenP = evaluations.filter(i => i === '好').length / evaluations.length * 100;
        const coloredPanelStyle = {
            background: `linear-gradient(to right, ${green}, ${green} ${greenP}%, ${yellow} ${greenP}%, ${yellow} ${greenP + yellowP}%, ${red} ${greenP + yellowP}%, ${red})`
        };
        return (
            <>
                <ExpansionPanel className={classes.card}>
                    <ExpansionPanelSummary style={coloredPanelStyle}>
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
                        <IconButton className={classes.iconButton} onClick={this.handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={this.state.anchorEl}
                            open={Boolean(this.state.anchorEl)}
                            onClose={this.handleMenuClose}
                        >
                            <MenuItem onClick={e => {
                                this.handleMenuClose(e);
                                this.toggleModalOpen(e);
                            }}>详细信息</MenuItem>
                        </Menu>
                        {/* this div is used to get avoid of default style on :last-child */}
                        <div style={{ position: 'absolute' }} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelActions classes={{
                        root: classes.cardAction
                    }}>
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
                <Modal open={this.state.modalOpen} onClose={this.toggleModalOpen} />
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
