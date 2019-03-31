import React, { PureComponent } from 'react';

import DatePicker from '../DatePicker';

interface Props {
    begin: Date;
    end: Date;
    stop: Date;
    classes: Record<string, string>;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (name: string) => (date: Date) => void;
}

class Schedule extends PureComponent<Props> {

    render() {
        const { onChange, disablePast, disabled, begin, end, stop, classes } = this.props;
        const pickers = [
            { label: '开始时间', name: 'begin', value: begin },
            { label: '报名截止', name: 'stop', value: stop },
            { label: '结束时间', name: 'end', value: end },
        ];
        return (
            <>
                {pickers.map(({ label, name, value }, index) =>
                    <DatePicker
                        label={label}
                        value={value}
                        onChange={onChange(name)}
                        disablePast={disablePast}
                        disabled={disabled}
                        classes={classes}
                        key={index}
                    />
                )}
            </>
        );
    }
}

export default Schedule;
