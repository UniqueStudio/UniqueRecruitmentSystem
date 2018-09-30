import React, { PureComponent } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

import styles from '../../style/chart';
import withRoot from '../../style/withRoot';

import { Time } from '../../lib/const';

interface Props extends WithStyles {
    dateInfo: Time;
    isLast: boolean;
    disabled: boolean;
    setDate: (event: React.ChangeEvent) => void;
    setTime: (event: React.ChangeEvent) => void;
    addDate: () => void;
    deleteDate: () => void;
}

class DateSelect extends PureComponent<Props> {

    render() {
        const { classes, dateInfo, setDate, setTime, addDate, deleteDate, isLast, disabled } = this.props;
        const { date, evening, afternoon, morning } = dateInfo;
        return (
            <div className={classes.dateSelect}>
                <TextField
                    label='日期'
                    type='date'
                    value={date}
                    InputLabelProps={{ shrink: true }}
                    onChange={setDate}
                    disabled={disabled}
                />
                <FormControl component='fieldset'>
                    <FormLabel component='legend'>{date}</FormLabel>
                    <FormGroup classes={{ root: classes.formGroup }}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={morning}
                                onChange={setTime}
                                value='morning'
                                color='primary'
                            />}
                            disabled={disabled}
                            label='上午'
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={afternoon}
                                onChange={setTime}
                                value='afternoon'
                                color='primary'
                            />}
                            disabled={disabled}
                            label='下午'
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={evening}
                                onChange={setTime}
                                value='evening'
                                color='primary'
                            />}
                            disabled={disabled}
                            label='晚上'
                        />
                    </FormGroup>
                </FormControl>
                {!disabled && <Button
                    color='primary'
                    variant='contained'
                    onClick={isLast ? addDate : deleteDate}
                >
                    {isLast ? '增加' : '删除'}
                </Button>}
            </div>
        );
    }
}

export default withRoot(withStyles(styles)(DateSelect));
