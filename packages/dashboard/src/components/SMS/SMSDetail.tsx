import React, { PureComponent } from 'react';

import classNames from 'classnames';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from 'Styles/template';

import { STEPS } from 'Config/consts';
import { Step } from 'Config/types';
import generateModel from 'Utils/generateModel';

export interface MainInfo extends WithStyles {
    type: string;
    step: Step | -1;
    time: string;
    place: string;
    rest: string;
}

interface Props extends MainInfo {
    handleChange: (name: string) => (event: React.ChangeEvent) => void;
}

class SMSDetail extends PureComponent<Props> {

    render() {
        const { classes, type, step, handleChange, time, place, rest } = this.props;
        const withRest = type === 'accept';
        const withTime = withRest && (step === 0 || step === 2);
        const withStep = !['group', 'team'].includes(type);
        const withPlace = withTime || !withStep;
        return (
            <>
                <div className={classNames(classes.templateContent, classes.templateItem)}>
                    <Typography variant='subtitle2' className={classes.templateItem}>
                        {generateModel({ type, step, time, place, rest })}
                    </Typography>
                </div>
                <div className={classNames(classes.templateContent, classes.templateItem, classes.templateParams, classes.inputContainer)}>
                    <TextField
                        select
                        label='类型'
                        value={type}
                        className={classNames(classes.templateItem, classes.input)}
                        onChange={handleChange('type')}
                    >
                        <MenuItem value='accept'>通过</MenuItem>
                        <MenuItem value='reject'>被刷</MenuItem>
                        <MenuItem value='group'>组面通知</MenuItem>
                        <MenuItem value='team'>群面通知</MenuItem>
                    </TextField>
                    {withStep && <TextField
                        select
                        label='轮次'
                        className={classNames(classes.templateItem, classes.input)}
                        value={step}
                        onChange={handleChange('step')}
                    >
                        {STEPS.slice(0, 5).map((stepName, index) => (
                            <MenuItem key={stepName} value={index}>{stepName}</MenuItem>
                        ))}
                    </TextField>}
                    {withTime && <TextField
                        label='时间'
                        value={time}
                        className={classNames(classes.templateItem, classes.input)}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange('time')}
                    />}
                    {withPlace && <TextField
                        label='地点'
                        value={place}
                        className={classNames(classes.templateItem, classes.input)}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange('place')}
                    />}
                    {withRest && <TextField
                        label='自定义'
                        value={rest}
                        className={classNames(classes.templateItem)}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange('rest')}
                    />}
                </div>
            </>
        );
    }
}

export default withStyles(styles)(SMSDetail);
