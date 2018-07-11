import * as React from "react";
import {
    Button,
    Divider,
    Paper,
    Typography,

    List,
    WithStyles,
    withStyles
} from "@material-ui/core";

import styles from "../style/style";
import Candidate from "../container/Candidate";
import withRoot from "../style/withRoot";

interface Props extends WithStyles {
    title: string;
    candidates: object;
    select: (name: Array<string>) => void;
    deselect: (name: Array<string>) => void;
    remove: (step: string, name: Array<string>) => void
}

const titleToStep = {
    '报名流程': '0',
    '笔试流程': '1',
    '面试流程': '2',
    '熬测流程': '3',
    '群面流程': '4',
};

class Column extends React.Component<Props> {
    handleSelectAll = () => {
        const { candidates, title, select } = this.props;
        select(Object.keys(candidates[titleToStep[title]]));
    };

    handleInverse = () => {
        const { candidates, title, select, deselect } = this.props;
        const allCandidates = Object.keys(candidates[titleToStep[title]]);
        const selectedCandidates = candidates['selected'].filter((i: string) => allCandidates.includes(i));
        deselect(selectedCandidates);
        select(allCandidates.filter((i: string) => !selectedCandidates.includes(i)));
    };

    handleRemove = () => {
        const { remove, title, candidates } = this.props;
        const allCandidates = Object.keys(candidates[titleToStep[title]]);
        remove(titleToStep[title], candidates['selected'].filter((i: string) => allCandidates.includes(i)));
    };

    render() {
        const { classes, title, candidates } = this.props;
        return (
            <Paper elevation={0} className={classes.column + ' ' + classes.whiteCardWithBorder}>
                <div className={classes.columnBody}>
                    <Typography variant="headline" className={classes.columnTitle}>
                        {title}
                    </Typography>
                    <Divider />
                    <List>
                        {Object.entries(candidates[titleToStep[title]]).map(i => (
                            <Candidate
                                step={titleToStep[title]}
                                name={i[0]}
                                grade={i[1]['grade']}
                                institute={i[1]['institute']}
                                comments={i[1]['comments']}
                                key={i[0]}
                            />
                        ))}
                    </List>
                </div>
                <Divider />
                <div className={classes.columnBottom}>
                    <Button
                        color='secondary'
                        size='small'
                        variant='text'
                        className={classes.columnButton}
                        onClick={this.handleSelectAll}
                    >全选</Button>
                    <Button
                        color='secondary'
                        size='small'
                        variant='text'
                        className={classes.columnButton}
                        onClick={this.handleInverse}
                    >反选</Button>
                    <Button
                        color='secondary'
                        size='small'
                        variant='text'
                        className={classes.columnButton}
                    >发送通知</Button>
                    <Button color='secondary'
                            size='small'
                            variant='contained'
                            className={classes.columnButton}
                            onClick={this.handleRemove}
                    >移除</Button>
                </div>
            </Paper>
        );
    }
}

export default withRoot(withStyles(styles)(Column));
