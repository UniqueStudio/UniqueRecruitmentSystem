import React, { PureComponent } from "react";
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/template'
import withRoot from '../../style/withRoot';
import generateModel from '../../lib/generateModel';
import { STEP, Time } from '../../lib/const';

export interface MainInfo extends WithStyles {
    type: string;
    step: string;
    date: Time[];
}

interface Props extends MainInfo {
    group: string;
    fns: {
        handleChange: (name: string) => (event: React.ChangeEvent) => void;
        changeDate: (id: number) => (event: React.ChangeEvent) => void;
        setTime: (id: number) => (event: React.ChangeEvent) => void;
        addDate: () => void;
        deleteDate: (id: number) => () => void;
    };
}

class Step extends PureComponent<Props> {

    render() {
        const { classes, group, type, step, date, fns } = this.props;
        const { handleChange, changeDate, setTime, addDate, deleteDate } = fns;
        const inputProps = { readOnly: true } as any;
        /* see https://github.com/mui-org/material-ui/issues/8047 */
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
                        {generateModel(type === 'accept', '{{候选人姓名}}', '{{招新名称}}', '{{组别}}', step)}
                    </Typography>
                </div>
                <div
                    className={classNames(classes.templateContent, classes.templateItem, classes.templateParams, classes.inputContainer)}>
                    <TextField
                        label="候选人姓名"
                        defaultValue='(默认)'
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={inputProps}
                    />
                    <TextField
                        label="招新名称"
                        defaultValue='(默认)'
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={inputProps}
                    />
                    <TextField
                        label="组别"
                        defaultValue={`${group}(默认)`}
                        className={classNames(classes.templateItem, classes.input)}
                        InputProps={inputProps}
                    />
                    <TextField
                        select
                        label="轮次"
                        className={classNames(classes.templateItem, classes.input)}
                        value={step}
                        onChange={handleChange("step")}
                    >
                        {STEP.map((i, j) => (
                            <MenuItem key={j} value={i}>
                                {i}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                {(step === '笔试流程' || step === '熬测流程') && type === 'accept' &&
                <div
                    className={classNames(classes.templateContent, classes.templateItem, classes.templateParams, classes.templateColumn)}>
                    {date.map((i, j) => (
                        <div key={j} className={classes.dateSelect}>
                            <TextField
                                label="日期"
                                type="date"
                                value={date[j].date}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className={classes.templateItem}
                                onChange={changeDate(j)}
                            />
                            <FormControl component="fieldset">
                                <FormLabel component="legend">{date[j].date}</FormLabel>
                                <FormGroup classes={{
                                    root: classes.formGroup
                                }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={date[j].morning}
                                                onChange={setTime(j)}
                                                value="morning"
                                            />
                                        }
                                        label="上午" />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={date[j].afternoon}
                                                onChange={setTime(j)}
                                                value="afternoon"
                                            />
                                        }
                                        label="下午" />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={date[j].evening}
                                                onChange={setTime(j)}
                                                value="evening"
                                            />
                                        }
                                        label="晚上" />
                                </FormGroup>
                            </FormControl>
                            <Button
                                color='primary'
                                variant='contained'
                                onClick={j === date.length - 1 ? addDate : deleteDate(j)}
                            >{
                                j === date.length - 1 ? '增加' : '删除'
                            }</Button>
                        </div>
                    ))}
                </div>}
            </>
        );
    }
}

export default withRoot(withStyles(styles)(Step));


