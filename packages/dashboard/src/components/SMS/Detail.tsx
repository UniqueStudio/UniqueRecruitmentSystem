import { MenuItem, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { ChangeEventHandler, FC, memo } from 'react';

import { STEP_MAP } from '@config/consts';
import { SMSType, Step } from '@config/enums';
import useStyles from '@styles/sms';

interface Props {
    content: {
        type: SMSType;
        next: Step | -1;
        time: string;
        place: string;
        rest: string;
    };
    message: string;
    handleChange: (name: string) => ChangeEventHandler<HTMLInputElement>;
}

export const SMSDetail: FC<Props> = memo(({ handleChange, content, message }) => {
    const classes = useStyles();
    const { type, time, place, rest, next } = content;
    return (
        <div className={clsx(classes.templateItem, classes.inputContainer)}>
            <Typography variant='body1' className={classes.fullWidth}>
                {message}
            </Typography>
            <TextField variant='standard' select label='类型' value={type} onChange={handleChange('type')}>
                <MenuItem value='accept'>通过</MenuItem>
                <MenuItem value='reject'>拒绝</MenuItem>
            </TextField>
            <TextField
                variant='standard'
                select
                label='下一轮'
                value={next >= 0 ? next : ''}
                onChange={handleChange('next')}
                disabled={type === SMSType.reject}
            >
                {[...STEP_MAP.entries()].map(([index, stepName]) => (
                    <MenuItem key={stepName} value={+index} disabled={index === Step.报名}>
                        {stepName}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                variant='standard'
                label='时间'
                value={time}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('time')}
                disabled={![Step.熬测, Step.笔试].includes(next)}
            />
            <TextField
                variant='standard'
                label='地点'
                value={place}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('place')}
                disabled={![Step.群面, Step.组面, Step.熬测, Step.笔试].includes(next)}
            />
            <TextField
                variant='standard'
                label='自定义'
                value={rest}
                className={classes.fullWidth}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('rest')}
                disabled={[Step.群面, Step.组面].includes(next)}
            />
        </div>
    );
});
