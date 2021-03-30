import { DatePicker as MuiDatePicker } from '@material-ui/pickers';
import React, { FC, memo } from 'react';

interface Props {
    value: Date;
    label: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (date: Date | null) => void;
}

export const DatePicker: FC<Props> = memo(({ onChange, value, label, disabled, disablePast = true }) => (
    <MuiDatePicker
        label={label}
        disablePast={disablePast}
        value={value}
        onChange={onChange}
        format='yyyy/MM/dd'
        disabled={disabled}
    />
));
