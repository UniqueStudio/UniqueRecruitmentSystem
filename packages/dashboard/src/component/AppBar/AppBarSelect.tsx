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

interface State {
    group: string;
}

class Selects extends PureComponent<Props> {
    state: State = {
        group: this.props.group
    };

    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        if (nextProps.group !== prevState.group) {
            return {
                group: nextProps.group
            }
        }
        return null;
    }

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
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


