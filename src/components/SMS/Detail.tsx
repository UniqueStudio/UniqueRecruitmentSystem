import { MenuItem, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { ChangeEventHandler, FC, memo } from 'react';

import { STEP_MAP } from '@config/consts';
import { SMSType, Step } from '@config/enums';
import useStyles from '@styles/sms';
import { generateModel } from '@utils/generateModel';

interface Props {
    content: {
        type: SMSType;
        step: Step | -1;
        next: Step | -1;
        time: string;
        place: string;
        rest: string;
    };
    handleChange: (name: string) => ChangeEventHandler<HTMLInputElement>;
}

const SMSDetail: FC<Props> = memo(({ handleChange, content }) => {
    const classes = useStyles();
    const { type, step, time, place, rest, next } = content;
    return (
        <div className={clsx(classes.templateItem, classes.inputContainer)}>
            <Typography variant='body1' className={classes.fullWidth}>
                {generateModel({ type, step, time, place, rest, next })}
            </Typography>
            <TextField select label='类型' value={type} onChange={handleChange('type')}>
                <MenuItem value='accept'>通过</MenuItem>
                <MenuItem value='reject'>拒绝</MenuItem>
            </TextField>
            <TextField select label='轮次' value={step === -1 ? '' : step} onChange={handleChange('step')}>
                {[...STEP_MAP.entries()].map(([index, stepName]) => (
                    <MenuItem
                        key={stepName}
                        value={index}
                        disabled={[Step.组面时间选择, Step.群面时间选择, Step.通过].includes(index)}>
                        {stepName}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label='下一轮'
                value={next === -1 ? '' : next}
                onChange={handleChange('next')}
                disabled={type === SMSType.reject}>
                {[...STEP_MAP.entries()].map(([index, stepName]) => (
                    <MenuItem key={stepName} value={+index} disabled={index <= step}>
                        {stepName}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label='时间'
                value={time}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('time')}
                disabled={![Step.熬测, Step.笔试].includes(next)}
            />
            <TextField
                label='地点'
                value={place}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange('place')}
                disabled={![Step.群面, Step.组面, Step.熬测, Step.笔试].includes(next)}
            />
            <TextField
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

export default SMSDetail;
