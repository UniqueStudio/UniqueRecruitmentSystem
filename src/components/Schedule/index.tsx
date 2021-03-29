import React, { FC, memo } from 'react';

import { DatePicker } from '@components/DatePicker';

interface Props {
    beginning: Date;
    end: Date;
    deadline: Date;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (name: string) => (date: Date | null) => void;
}

export const Schedule: FC<Props> = memo(({ onChange, disablePast, disabled, beginning, end, deadline }) => {
    const pickers = [
        { label: '开始时间', name: 'beginning', value: beginning },
        { label: '报名截止', name: 'deadline', value: deadline },
        { label: '结束时间', name: 'end', value: end },
    ];
    return (
        <>
            {pickers.map(({ label, name, value }) => (
                <DatePicker
                    label={label}
                    value={value}
                    onChange={onChange(name)}
                    disablePast={disablePast}
                    disabled={disabled}
                    key={label}
                />
            ))}
        </>
    );
});
