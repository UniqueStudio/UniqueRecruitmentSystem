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
        return (
            <>
                <DatePicker
                    label='开始时间'
                    value={begin}
                    onChange={onChange('begin')}
                    disablePast={disablePast}
                    disabled={disabled}
                    classes={classes}
                />
                <DatePicker
                    label='报名截止'
                    value={stop}
                    onChange={onChange('stop')}
                    disablePast={disablePast}
                    disabled={disabled}
                    classes={classes}
                />
                <DatePicker
                    label='结束时间'
                    value={end}
                    onChange={onChange('end')}
                    disablePast={disablePast}
                    disabled={disabled}
                    classes={classes}
                />
            </>
        );
    }
}

export default Schedule;
