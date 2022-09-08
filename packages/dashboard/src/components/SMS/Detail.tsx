import { MenuItem, TextField, Typography } from '@mui/material';
import clsx from 'clsx';
import React, { ChangeEventHandler, FC, memo } from 'react';

import { STEP_MAP } from '@config/consts';
import { SMSType, Step } from '@config/enums';
import { SMSTemplate } from '@config/types';
import useStyles from '@styles/sms';

interface Props {
    content: SMSTemplate;
    message: string;
    handleChange: (name: keyof SMSTemplate) => ChangeEventHandler<HTMLInputElement>;
}

export const SMSDetail: FC<Props> = memo(({ handleChange, content, message }) => {
    const classes = useStyles();
    const { type, time, place, meetingId, rest, next, current } = content;
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
                label='本轮'
                value={current ?? ''}
                onChange={handleChange('current')}
                disabled={[Step.群面, Step.组面].includes(next!)}
            >
                {[...STEP_MAP.entries()].map(([index, stepName]) => (
                    <MenuItem key={stepName} value={+index} disabled={index === Step.通过}>
                        {stepName}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                variant='standard'
                select
                label='下一轮'
                value={next ?? ''}
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
                value={time ?? ''}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('time')}
                disabled={![Step.熬测, Step.笔试, Step.组面, Step.在线组面, Step.群面, Step.在线群面].includes(next!)}
            />
            {![Step.在线组面, Step.在线群面].includes(next!) ? (
                <TextField
                    variant='standard'
                    label='地点'
                    value={place ?? ''}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange('place')}
                    disabled={![Step.群面, Step.组面, Step.熬测, Step.笔试].includes(next!)}
                />
            ) : (
                <TextField
                    variant='standard'
                    label='会议号'
                    value={meetingId ?? ''}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleChange('meetingId')}
                />
            )}
            <TextField
                variant='standard'
                label='自定义'
                value={rest ?? ''}
                className={classes.fullWidth}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('rest')}
                disabled={[Step.群面, Step.组面, Step.在线群面, Step.在线组面].includes(next!)}
            />
        </div>
    );
});
