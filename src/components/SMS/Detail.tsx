import React, { ChangeEventHandler, FC, memo } from 'react';

import clsx from 'clsx';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { STEPS } from '../../config/consts';
import { Step } from '../../config/types';

import useStyles from '../../styles/sms';

import { generateModel } from '../../utils/generateModel';

interface Props {
    content: {
        type: string;
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
    const withRest = type === 'accept';
    const withTime = withRest && (next === 1 || next === 3);
    const withStep = !['group', 'team'].includes(type);
    const withPlace = withTime || !withStep;
    return (
        <>
            <div className={clsx(classes.templateContent, classes.templateItem)}>
                <Typography variant='subtitle2' className={classes.templateItem}>
                    {generateModel({ type, step, time, place, rest, next })}
                </Typography>
            </div>
            <div
                className={clsx(
                    classes.templateContent,
                    classes.templateItem,
                    classes.templateParams,
                    classes.inputContainer,
                )}>
                <TextField
                    select
                    label='类型'
                    value={type}
                    className={clsx(classes.templateItem, classes.input)}
                    onChange={handleChange('type')}>
                    <MenuItem value='accept'>通过</MenuItem>
                    <MenuItem value='reject'>被刷</MenuItem>
                    <MenuItem value='group'>组面通知</MenuItem>
                    <MenuItem value='team'>群面通知</MenuItem>
                </TextField>
                {withStep && (
                    <TextField
                        select
                        label='轮次'
                        className={clsx(classes.templateItem, classes.input)}
                        value={step}
                        onChange={handleChange('step')}>
                        {STEPS.slice(0, 5).map((stepName, index) => (
                            <MenuItem key={stepName} value={index}>
                                {stepName}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {withStep && (
                    <TextField
                        select
                        label='下一轮'
                        className={clsx(classes.templateItem, classes.input)}
                        value={next}
                        onChange={handleChange('next')}>
                        {STEPS.map((stepName, index) => (
                            <MenuItem key={stepName} value={index}>
                                {stepName}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
                {withTime && (
                    <TextField
                        label='时间'
                        value={time}
                        className={clsx(classes.templateItem, classes.input)}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange('time')}
                    />
                )}
                {withPlace && (
                    <TextField
                        label='地点'
                        value={place}
                        className={clsx(classes.templateItem, classes.input)}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange('place')}
                    />
                )}
                {withRest && (
                    <TextField
                        label='自定义'
                        value={rest}
                        className={clsx(classes.templateItem)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange('rest')}
                    />
                )}
            </div>
        </>
    );
});

export default SMSDetail;
