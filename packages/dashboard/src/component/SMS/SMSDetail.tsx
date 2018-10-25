import React, { PureComponent } from 'react';

import classNames from 'classnames';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/template';

import { STEPS } from '../../lib/const';
import generateModel from '../../lib/generateModel';

export interface MainInfo extends WithStyles {
    type: string;
    step: string;
    time: string;
    place: string;
    rest: string;
}

interface Props extends MainInfo {
    group: string;
    handleChange: (name: string) => (event: React.ChangeEvent) => void;
}

class SMSDetail extends PureComponent<Props> {

    render() {
        const { classes, group, type, step, handleChange, time, place, rest } = this.props;
        const inputProps = { readOnly: true };
        return (
            <>
                <div className={classNames(classes.templateContent, classes.templateItem)}>
                    <Select
                        value={type}
                        onChange={handleChange('type')}
                    >
                        <MenuItem value='accept'>通过</MenuItem>
                        <MenuItem value='reject'>被刷</MenuItem>
                    </Select>
                    <Typography variant='subheading' className={classes.templateItem}>
                        {generateModel({
                            accepted: type === 'accept',
                            step,
                            time,
                            place,
                            rest
                        })}
                    </Typography>
                </div>
                <div
                    className={classNames(classes.templateContent, classes.templateItem, classes.templateParams, classes.inputContainer)}>
                    <TextField
                        label='候选人姓名'
                        defaultValue='(默认)'
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={{ inputProps }}
                    />
                    <TextField
                        label='招新名称'
                        defaultValue='(默认)'
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={{ inputProps }}
                    />
                    <TextField
                        label='组别'
                        defaultValue={`${group}(默认)`}
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={{ inputProps }}
                    />
                    <TextField
                        select
                        label='轮次'
                        className={classNames(classes.templateItem, classes.input)}
                        value={step}
                        onChange={handleChange('step')}
                    >
                        {STEPS.slice(0, 5).map((stepName) => (
                            <MenuItem key={stepName} value={stepName}>
                                {stepName}
                            </MenuItem>
                        ))}
                    </TextField>
                    {type === 'accept' && <TextField
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
                {(step === STEPS[0] || step === STEPS[2]) && type === 'accept' && !rest &&
                <div className={classNames(classes.templateContent, classes.templateItem, classes.templateParams)}>
                    <TextField
                        label='时间'
                        value={time}
                        className={classNames(classes.templateItem, classes.input)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange('time')}
                    />
                    <TextField
                        label='地点'
                        value={place}
                        className={classNames(classes.templateItem, classes.input)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleChange('place')}
                    />
                </div>}
            </>
        );
    }
}

export default withStyles(styles)(SMSDetail);
