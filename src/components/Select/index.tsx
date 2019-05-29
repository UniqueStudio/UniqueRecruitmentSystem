import React, { PureComponent } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import withStyles, { WithStyles } from '@material-ui/styles/withStyles';

import styles from '../../styles/select';

interface Props extends WithStyles<typeof styles> {
    data: (string | number)[];
    values: (string | number)[];
    currentValue: string | number;
    onChange?: (event: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

class CustomSelect extends PureComponent<Props> {

    render() {
        const { classes, data, values, onChange, currentValue } = this.props;
        return (
            <Select
                value={currentValue}
                onChange={onChange}
                className={classes.select}
            >
                {data.map((item, index) => <MenuItem value={values[index]} key={index}>{item}</MenuItem>)}
            </Select>
        );
    }
}

export default withStyles(styles)(CustomSelect);
