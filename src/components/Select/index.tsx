import { MenuItem, Select as MuiSelect } from '@material-ui/core';
import React, { ChangeEventHandler, FC, memo } from 'react';

import useStyles from '@styles/select';

interface Props {
    data: (string | number)[];
    values: (string | number)[];
    currentValue: string | number;
    onChange?: ChangeEventHandler<{ name?: string; value: unknown }>;
}

export const Select: FC<Props> = memo(({ data, values, onChange, currentValue }) => {
    const classes = useStyles();
    return (
        <MuiSelect value={currentValue} onChange={onChange} className={classes.select}>
            {data.map((item, index) => (
                <MenuItem value={values[index]} key={index}>
                    {item}
                </MenuItem>
            ))}
        </MuiSelect>
    );
});
