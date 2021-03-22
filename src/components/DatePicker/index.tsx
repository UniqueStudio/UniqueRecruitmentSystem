import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { FC, memo } from 'react';

interface Props {
    value: Date;
    className: string;
    label: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (date: Date | null) => void;
}

const Picker: FC<Props> = memo(({ className, onChange, value, label, disabled, disablePast = true }) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
            label={label}
            className={className}
            disablePast={disablePast}
            value={value}
            onChange={onChange}
            format='yyyy/MM/dd'
            disabled={disabled}
        />
    </MuiPickersUtilsProvider>
));

export default Picker;
