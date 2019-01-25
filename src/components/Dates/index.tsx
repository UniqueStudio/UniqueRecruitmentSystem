import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import { Time } from 'Config/types';
import styles from 'Styles/data';
import DatePicker from '../DatePicker';

interface Props extends WithStyles {
    dates: Time[];
    disabled: boolean;
    setRecruitment: (interview: Time[]) => void;
}

class Dates extends PureComponent<Props> {

    state = {
        dates: this.props.dates.map((date) => ({ ...date, date: new Date(date.date) }))
    };

    cancel = () => {
        this.setState({
            dates: this.props.dates.map((date) => ({ ...date, date: new Date(date.date) }))
        });
    };
    getDefaultDate = () => ({
        date: new Date(),
        morning: 0,
        afternoon: 0,
        evening: 0,
    });

    setTime = (dates: object) => {
        this.setState({
            dates
        });
    };

    getTime = () => {
        return [...this.state.dates];
    };

    addDate = () => {
        const time = this.getTime();
        time.push(this.getDefaultDate());
        this.setTime(time);
    };

    setDate = (id: number) => (date: Date) => {
        const time = this.getTime();
        time[id].date = date;
        this.setTime(time);
    };

    deleteDate = (id: number) => () => {
        const time = this.getTime();
        time.splice(id, 1);
        this.setTime(time);
    };

    setPeriod = (id: number, period: 'morning' | 'afternoon' | 'evening') => ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const time = this.getTime();
        time[id][period] = +value;
        this.setTime(time);
    };

    submit = () => {
        this.props.setRecruitment(this.state.dates.map((date) => ({ ...date, date: +date.date })));
    };

    render() {
        const { classes, disabled } = this.props;
        const { dates } = this.state;
        return (
            <div className={classes.dates}>
                {!dates.length ? <Button onClick={this.addDate} variant='contained' color='primary' disabled={disabled}>设置</Button> : (
                    <div className={classes.buttonContainer}>
                        <Button onClick={this.addDate} color='primary' variant='contained' disabled={disabled}>增加</Button>
                        <Button onClick={this.cancel} color='primary' variant='contained' disabled={disabled}>取消</Button>
                        <Button onClick={this.submit} variant='contained' color='primary' disabled={disabled}>提交</Button>
                    </div>
                )}
                {dates.map(({ morning, afternoon, evening, date }, index) =>
                    <div className={classes.textFieldContainer} key={index}>
                        <DatePicker
                            label='日期'
                            value={date}
                            onChange={this.setDate(index)}
                            disabled={disabled}
                            classes={classes}
                            disablePast={false}
                        />
                        <TextField
                            label='上午'
                            value={Math.max(morning, 0)}
                            onChange={this.setPeriod(index, 'morning')}
                            className={classes.textField}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            margin='normal'
                            disabled={disabled}
                        />
                        <TextField
                            label='下午'
                            value={Math.max(afternoon, 0)}
                            onChange={this.setPeriod(index, 'afternoon')}
                            className={classes.textField}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            margin='normal'
                            disabled={disabled}
                        />
                        <TextField
                            label='晚上'
                            value={Math.max(evening, 0)}
                            onChange={this.setPeriod(index, 'evening')}
                            className={classes.textField}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            margin='normal'
                            disabled={disabled}
                        />
                        <Button
                            color='primary'
                            variant='contained'
                            disabled={disabled}
                            onClick={this.deleteDate(index)}
                        >删除</Button>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles)(Dates);
