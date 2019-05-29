import React, { PureComponent } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

interface Props {
    value: Date;
    classes: Record<string, string>;
    label: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (date: Date | null) => void;
}

class Picker extends PureComponent<Props> {

    render() {
        const { classes, onChange, value, label, disabled, disablePast = true } = this.props;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                    label={label}
                    className={classes.datePicker}
                    disablePast={disablePast}
                    value={value}
                    onChange={onChange}
                    format='yyyy/MM/dd'
                    disabled={disabled}
                />
            </MuiPickersUtilsProvider>
        );
    }
}

export default Picker;
