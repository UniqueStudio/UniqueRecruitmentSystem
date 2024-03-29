import { MenuItem, Select as MuiSelect, SelectProps } from '@mui/material';
import React, { FC, memo } from 'react';

import useStyles from '@styles/select';

interface Props<T = string | number> {
    data: { item: T; value: T; disabled?: boolean }[];
    currentValue: T;
    onChange?: SelectProps['onChange'];
}

export const Select: FC<Props> = memo(({ data, onChange, currentValue }) => {
    const classes = useStyles();
    return (
        <MuiSelect variant='standard' value={currentValue} onChange={onChange} className={classes.select}>
            {data.map(({ item, value, disabled }, index) => (
                <MenuItem value={value} key={index} disabled={disabled}>
                    {item}
                </MenuItem>
            ))}
        </MuiSelect>
    );
});
