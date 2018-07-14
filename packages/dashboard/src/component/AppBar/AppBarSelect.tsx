import * as React from 'react';
import {
    MenuItem,
    Select,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../../style/index'
import withRoot from '../../style/withRoot';
import { GROUP } from '../../constants';

interface Props extends WithStyles {
    setGroup: (group: string) => void;
}

class Selects extends React.Component<Props> {
    state = {
        group: 'web'
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({ group: event.target['value'] });
        this.props.setGroup(event.target['value']);
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
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


