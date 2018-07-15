import * as React from 'react';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import generateModal from '../../lib/generateModel';
import { STEP as steps } from '../../lib/const';


interface Props extends WithStyles {
    step: string;
    group: string
}

const models = {
    reject: generateModal(false, '{{候选人姓名}}', '{{招新名称}}', '{{组别}}', '{{轮次}}'),
    accept: generateModal(true, '{{候选人姓名}}', '{{招新名称}}', '{{组别}}', '{{轮次}}'),
};

class Step extends React.Component<Props> {

    state = {
        model: 'accept',
        name: '(默认)',
        title: '8102年秋招(默认)',
        group: `${this.props.group}(默认)`,
        step: `${steps[+this.props.step]}(默认)`,
    };

    handleAccept = (event: React.ChangeEvent) => {
        this.setState({ model: event.target['value'] });
    };

    handleChange = (name: string) => (event: React.ChangeEvent) => {
        this.setState({
            [name]: event.target['value'],
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <>
                <div className={classNames(classes.templateContent, classes.templateItem)}>
                    <Select
                        value={this.state.model}
                        onChange={this.handleAccept}
                    >
                        <MenuItem value='accept'>通过</MenuItem>
                        <MenuItem value='reject'>被刷</MenuItem>
                    </Select>
                    <Typography variant='subheading' className={classes.templateItem}>
                        {models[this.state.model]}
                    </Typography>
                </div>
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
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


