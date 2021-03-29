import DateFnsUtils from '@date-io/date-fns';
import { DatePicker as MuiDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { FC, memo } from 'react';

interface Props {
    value: Date;
    label: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (date: Date | null) => void;
}

export const DatePicker: FC<Props> = memo(({ onChange, value, label, disabled, disablePast = true }) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiDatePicker
            label={label}
            disablePast={disablePast}
            value={value}
            onChange={onChange}
            format='yyyy/MM/dd'
            disabled={disabled}
        />
    </MuiPickersUtilsProvider>
));
