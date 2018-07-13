import * as React from 'react';
import * as classNames from 'classnames';
import {
    MenuItem,
    Select, Typography,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import generateModal from '../../lib/generateModel';

const models = {
    reject: generateModal(false, '{{候选人姓名}}', '{{招新名称}}', '{{组别}}', '{{轮次}}'),
    accept: generateModal(true, '{{候选人姓名}}', '{{招新名称}}', '{{组别}}', '{{轮次}}'),
};

class Step extends React.Component<WithStyles> {

    state = {
        model: 'accept'
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({ model: event.target['value'] });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classNames(classes.templateContent, classes.templateItem)}>
                <Select
                    value={this.state.model}
                    onChange={this.handleChange}
                >
                    <MenuItem value='accept'>通过</MenuItem>
                    <MenuItem value='reject'>被刷</MenuItem>
                </Select>
                <Typography variant='subheading' className={classes.templateItem}>
                    {models[this.state.model]}
                </Typography>
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


