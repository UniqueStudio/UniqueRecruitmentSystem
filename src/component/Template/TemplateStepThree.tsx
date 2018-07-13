import * as React from 'react';
import * as classNames from 'classnames';
import {
    TextField,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/template'
import withRoot from '../../style/withRoot';

interface Props extends WithStyles {
    step: string;
    group: string
}

const steps = ['报名流程', '笔试流程', '面试流程', '熬测流程', '群面流程'];

class Step extends React.Component<Props> {

    state = {
        name: '(默认)',
        title: '8102年秋招(默认)',
        group: `${this.props.group}(默认)`,
        step: `${steps[+this.props.step]}(默认)`,
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value'],
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem, classes.templateParams)}>
                <TextField
                    label="候选人姓名"
                    onChange={this.handleChange("name")}
                    value={this.state.name}
                    className={classes.templateItem}
                />
                <TextField
                    label="招新名称"
                    onChange={this.handleChange("title")}
                    value={this.state.title}
                    className={classes.templateItem}
                />
                <TextField
                    label="组别"
                    onChange={this.handleChange("group")}
                    value={this.state.group}
                    className={classes.templateItem}
                />
                <TextField
                    label="轮次"
                    onChange={this.handleChange("step")}
                    value={this.state.step}
                    className={classes.templateItem}
                />
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


