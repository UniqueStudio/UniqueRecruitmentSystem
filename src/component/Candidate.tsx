import * as React from "react";
import {
    Avatar,
    Button,
    Card,
    TextField,
    CardHeader,
    CardContent,
    Chip,
    MenuList,
    MenuItem,
    Popover,
    ListItem,
    // Checkbox,
    Typography,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    WithStyles,
    withStyles,
} from "@material-ui/core";
import { Comment } from "@material-ui/icons";
import styles from "../style/style";
import withRoot from "../style/withRoot";

const DURATION = 300;

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
        anchorEl: null,
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
                // Forcely close popover
                anchorEl: null
            }, () => {
                setTimeout(() => {
                    this.setState({
                        evaluation: '',
                        comment: ''
                    })
                }, DURATION);
            })
        } else {
            this.props.toggleOn('请完整填写评论！');
        }
    };

    handleClick = (event: any) => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };
    handleClose = () => {
        this.setState({
            anchorEl: null,
        }, () => {
            if (this.state.comment) return
            setTimeout(() => {
                this.setState({
                    evaluation: '',
                    comment: ''
                })
            }, DURATION);
        });
    };
    
    handleEvaluation = (evaluation: string) => {
        const anchorEl = this.state.anchorEl;
        this.setState({
            anchorEl: null
        }, () => {
            setTimeout(() => {
                this.setState({
                    evaluation,
                    anchorEl
                })
            }, DURATION);
        });
    }

    render() {
        const { name, grade, institute, comments, /* selected, */ classes } = this.props;
        return (
            <ListItem className={classes.candidateListItem}>
                <ListItemText
                    primary={<>
                        <Typography style={{ flex: 1 }} variant="title">{name}</Typography>
                        <Typography variant="subheading" style={{ marginBottom: '8px' }}>{`${grade} - ${institute}`}</Typography>
                    </>}
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={<>{
                        Object.entries(comments).map(([name, { comment }], i) =>
                            <Chip
                                style={{ margin: '4px', marginLeft: '0' }}
                                key={name}
                                label={comment}
                                avatar={<Avatar>{name}</Avatar>}
                                onDelete={i === 0 ? () => {} : void 0}
                            />
                        )
                    }</>}
                />
                <ListItemSecondaryAction>
                    <IconButton onClick={this.handleClick}>
                        <Comment />
                    </IconButton>
                    <Popover
                        open={Boolean(this.state.anchorEl)}
                        anchorEl={this.state.anchorEl!}
                        onClose={this.handleClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        {
                            this.state.evaluation
                            ? (
                                <Card>
                                    <CardHeader
                                        title={`简要评价 ${name}`}
                                        subheader="不要超过16个字"
                                    />
                                    <CardContent>
                                        <Typography>你给Ta的等级是"{this.state.evaluation}"</Typography>
                                        <TextField
                                            autoFocus
                                            label="输入评论"
                                            value={this.state.comment}
                                            onChange={this.handleChange("comment")}
                                            onKeyDown={e => e.keyCode === 13 && this.handleSubmit()}
                                        />
                                        <Button color="primary" size="small" onClick={this.handleSubmit}>
                                            发表评论
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <MenuList>
                                    {['不错', '一般', '不行'].map(
                                        (e) =>
                                            <MenuItem key={e} onClick={this.handleEvaluation.bind(this, e)}>{e}</MenuItem>
                                    )}
                                </MenuList>
                            )
                        }
                    </Popover>
                    {/* or */}
                    {/* <Checkbox tabIndex={-1} /> */}
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

export default withRoot(withStyles(styles)(Candidate));
