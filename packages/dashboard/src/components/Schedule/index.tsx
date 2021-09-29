import {
    MobileDatePicker,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
} from '@mui/lab';
import { TextField } from '@mui/material';
import React, { FC, memo } from 'react';

import useStyles from '@styles/schedule';

interface Props {
    beginning: Date;
    end: Date;
    deadline: Date;
    disabled?: boolean;
    onChange: (name: 'beginning' | 'deadline' | 'end') => (date: unknown) => void;
}

export const Schedule: FC<Props> = memo(({ beginning, end, deadline, disabled, onChange }) => {
    const classes = useStyles();
    const items = [
        { label: '招新开始', name: 'beginning' as const, value: beginning },
        { label: '报名截止', name: 'deadline' as const, value: deadline },
        { label: '招新结束', name: 'end' as const, value: end },
    ];
    return (
        <Timeline position='left' classes={{ root: classes.root }}>
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
                        <MobileDatePicker
                            value={value}
                            onChange={onChange(name)}
                            disabled={disabled}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
});
