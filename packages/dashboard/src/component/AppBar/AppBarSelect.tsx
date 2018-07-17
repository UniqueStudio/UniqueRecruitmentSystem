import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { WithStyles, withStyles } from '@material-ui/core/styles';

import styles from '../../style/index'
import withRoot from '../../style/withRoot';
import { GROUP } from '../../lib/const';

interface Props extends WithStyles {
    changeGroup: (group: string) => void
}

class Selects extends React.Component<Props> {
    state = {
        group: 'web'
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
                {[...GROUP].map(i =>
                    <MenuItem value={i.toLowerCase()} key={i.toLowerCase()}>{i}</MenuItem>
                )}
                <MenuItem value='all' disabled>{'群面(不可用)'/*TODO*/}</MenuItem>
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


