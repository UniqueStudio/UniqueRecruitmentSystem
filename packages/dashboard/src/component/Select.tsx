import * as React from 'react';
import {
    MenuItem,
    Select,
    WithStyles,
    withStyles
} from '@material-ui/core';
import styles from '../style/style'
import withRoot from '../style/withRoot';

interface Props extends WithStyles {
    open: boolean;
    toggleOpen: () => void;
}

class Selects extends React.Component<Props> {
    state = {
        group: ''
    };

    handleChange = (event: React.ChangeEvent) => {
        this.setState({ group: event.target['value'] });
    };

    render() {
        const { classes } = this.props;
        return (
            <Select
                value={this.state.group}
                onChange={this.handleChange}
                className={classes.select}
            >
                <MenuItem value='web'>web</MenuItem>
                <MenuItem value='lab'>lab</MenuItem>
                <MenuItem value='ai'>AI</MenuItem>
                <MenuItem value='game'>game</MenuItem>
                <MenuItem value='android'>android</MenuItem>
                <MenuItem value='ios'>iOS</MenuItem>
                <MenuItem value='design'>design</MenuItem>
                <MenuItem value='pm'>PM</MenuItem>
            </Select>
        );
    }
}

export default withRoot(withStyles(styles)(Selects));


