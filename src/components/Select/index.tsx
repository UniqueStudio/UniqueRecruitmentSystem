import React, { PureComponent } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../styles/select';

interface Props extends WithStyles {
    data: (string | number)[];
    values: (string | number)[];
    currentValue: string | number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
