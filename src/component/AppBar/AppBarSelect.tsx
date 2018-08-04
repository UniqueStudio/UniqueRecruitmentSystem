import React, { PureComponent } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/appBar'
import withRoot from '../../style/withRoot';
import { GROUP } from '../../lib/const';

interface Props extends WithStyles {
    group: string;
    changeGroup: (group: string) => void;
}

class Selects extends PureComponent<Props> {
    state = {
        group: this.props.group
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({ group: event.target['value'] });
        this.props.changeGroup(event.target['value']);
    };

    render() {
        const { classes } = this.props;
        return (
            <Select
                value={this.state.group}
                onChange={this.handleChange}
                className={classes.select}
            >
                {GROUP.map(i =>
                    <MenuItem value={i.toLowerCase()} key={i.toLowerCase()}>{i}</MenuItem>
                )}
                <MenuItem value='all' disabled>{'群面(咕咕咕)'/*TODO*/}</MenuItem>
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


