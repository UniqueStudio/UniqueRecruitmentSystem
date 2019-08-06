import React, { FC, memo } from 'react';

import DatePicker from '../DatePicker';

interface Props {
    begin: Date;
    end: Date;
    stop: Date;
    className: string;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (name: string) => (date: Date | null) => void;
}

const Schedule: FC<Props> = memo(({ onChange, disablePast, disabled, begin, end, stop, className }) => {
    const pickers = [
        { label: '开始时间', name: 'begin', value: begin },
        { label: '报名截止', name: 'stop', value: stop },
        { label: '结束时间', name: 'end', value: end },
    ];
    return (
        <>
            {pickers.map(({ label, name, value }, index) => (
                <DatePicker
                    label={label}
                    value={value}
                    onChange={onChange(name)}
                    disablePast={disablePast}
                    disabled={disabled}
                    className={className}
                    key={index}
                />
            ))}
        </>
    );
});

export default Schedule;
