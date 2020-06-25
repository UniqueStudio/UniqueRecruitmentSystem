import React, { FC, memo } from 'react';

import { MobileDateTimePicker, LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import { TextField } from '@material-ui/core';

interface Props {
    value: Date;
    className: string;
    label: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (date: Date | null) => void;
}

const Picker: FC<Props> = memo(({ className, onChange, value, label, disabled = false, disablePast = true }) => (
    <LocalizationProvider dateAdapter={DateFnsUtils}>
        <MobileDateTimePicker
            label={label}
            disablePast={disablePast}
            value={value}
            ampm={false}
            onChange={onChange as (date: unknown) => void}
            inputFormat='yyyy/MM/dd HH:mm'
            mask='___/__/__ __:__'
            renderInput={props => <TextField {...props} helperText={undefined} className={className} />}
            disabled={disabled}
        />
    </LocalizationProvider>
));

export default Picker;
