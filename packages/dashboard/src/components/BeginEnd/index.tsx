import React, { PureComponent } from 'react';

import DatePicker from '../DatePicker';

interface Props {
    begin: Date;
    end: Date;
    classes: Record<string, string>;
    disabled?: boolean;
    disablePast?: boolean;
    onChange: (name: string) => (date: Date) => void;
}

class BeginEnd extends PureComponent<Props> {

    render() {
        const { onChange, disablePast, disabled, begin, end, classes } = this.props;
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

export default BeginEnd;
