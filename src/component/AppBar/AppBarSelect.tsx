import React, { PureComponent } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/appBar';

interface Props extends WithStyles {
    data: string[];
    values: string[];
    currentValue: string;
    onChange?: (event: React.ChangeEvent) => void;
}

class Selects extends PureComponent<Props> {

    render() {
        const { classes, data, values, onChange, currentValue } = this.props;
        return (
            <Select
                value={currentValue}
                onChange={onChange}
                className={classes.select}
            >
                {data.map((i, j) => <MenuItem value={values[j]} key={j}>{i}</MenuItem>)}
            </Select>
        );
    }
}

export default withStyles(styles)(Selects);
