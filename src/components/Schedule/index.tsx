import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import React, { FC, memo } from 'react';

import useStyles from '@styles/schedule';

interface Props {
    beginning: Date;
    end: Date;
    deadline: Date;
    disabled?: boolean;
    onChange: (name: string) => (date: Date | null) => void;
}

export const Schedule: FC<Props> = memo(({ beginning, end, deadline, disabled, onChange }) => {
    const classes = useStyles();
    const items = [
        { label: '招新开始', name: 'beginning', value: beginning },
        { label: '报名截止', name: 'deadline', value: deadline },
        { label: '招新结束', name: 'end', value: end },
    ];
    return (
        <Timeline align='left' classes={{ root: classes.root }}>
            {items.map(({ label, name, value }) => (
                <TimelineItem key={label}>
                    <TimelineOppositeContent className={classes.item} classes={{ root: classes.itemRoot }}>
                        {label}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent className={classes.item}>
                        <DatePicker
                            value={value}
                            onChange={onChange(name)}
                            disabled={disabled}
                            format='yyyy/MM/dd'
                            inputVariant='outlined'
                        />
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
});
