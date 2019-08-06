import React, { ChangeEventHandler, FC, memo } from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import useStyles from '../../styles/select';

interface Props {
    data: (string | number)[];
    values: (string | number)[];
    currentValue: string | number;
    onChange?: ChangeEventHandler<{ name?: string; value: unknown }>;
}

const CustomSelect: FC<Props> = memo(({ data, values, onChange, currentValue }) => {
    const classes = useStyles();
    return (
        <Select
            value={currentValue}
            onChange={onChange}
            className={classes.select}
        >
            {data.map((item, index) => <MenuItem value={values[index]} key={index}>{item}</MenuItem>)}
        </Select>
    );
});

export default CustomSelect;
