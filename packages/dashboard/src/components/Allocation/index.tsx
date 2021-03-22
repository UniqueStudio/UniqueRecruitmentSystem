import Accordion from '@material-ui/core/Accordion';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import React, { ChangeEventHandler, FC, memo, useState } from 'react';

import { Time } from '../../config/types';
import useStyles from '../../styles/data';
import DatePicker from '../DatePicker';

interface Props {
    dates: Time[];
    disabled: boolean;
    title: string;
    setRecruitment: (interview: Time[]) => void;
}

const getDefaultDate = () => ({
    date: new Date(),
    morning: 0,
    afternoon: 0,
    evening: 0,
});

const Allocation: FC<Props> = memo(({ disabled, title, dates, setRecruitment }) => {
    const classes = useStyles();
    const initialDates = dates.map((item) => ({ ...item, date: new Date(item.date) }));
    const [allocation, setAllocation] = useState(initialDates);
    const cancel = () => {
        setAllocation(initialDates);
    };

    const addDate = () => {
        setAllocation([...allocation, getDefaultDate()]);
    };

    const setDate = (id: number) => (date: Date | null) => {
        if (date) {
            setAllocation((prevAllocation) => {
                const time = [...prevAllocation];
                time[id].date = date;
                return time;
            });
        }
    };

    const deleteDate = (id: number) => () => {
        setAllocation((prevAllocation) => {
            const time = [...prevAllocation];
            time.splice(id, 1);
            return time;
        });
    };

    const setPeriod = (id: number, period: keyof Time): ChangeEventHandler<HTMLInputElement> => ({
        target: { value },
    }) => {
        if (period !== 'date') {
            setAllocation((prevAllocation) => {
                const time = [...prevAllocation];
                time[id][period] = +value;
                return time;
            });
        }
    };

    const submit = () => {
        setRecruitment(allocation.map((item) => ({ ...item, date: +item.date })));
    };

    const getButton = (name: string, children: JSX.Element, handler: () => void) => (
        <Tooltip title={name}>
            <IconButton onClick={handler} color='primary' disabled={disabled} size='small'>
                {children}
            </IconButton>
        </Tooltip>
    );

    return (
        <Accordion className={classes.expansion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>{title}</AccordionSummary>
            <AccordionDetails classes={{ root: classes.expansionDetails }}>
                <div className={classes.dates}>
                    {allocation.map(({ morning, afternoon, evening, date }, index) => (
                        <div className={classes.textFieldContainer} key={index}>
                            <DatePicker
                                label='日期'
                                value={date}
                                onChange={setDate(index)}
                                disabled={disabled}
                                className={classes.datePicker}
                                disablePast={false}
                            />
                            <TextField
                                label='上午'
                                value={Math.max(morning, 0)}
                                onChange={setPeriod(index, 'morning')}
                                className={classes.textField}
                                type='number'
                                InputLabelProps={{ shrink: true }}
                                margin='normal'
                                disabled={disabled}
                            />
                            <TextField
                                label='下午'
                                value={Math.max(afternoon, 0)}
                                onChange={setPeriod(index, 'afternoon')}
                                className={classes.textField}
                                type='number'
                                InputLabelProps={{ shrink: true }}
                                margin='normal'
                                disabled={disabled}
                            />
                            <TextField
                                label='晚上'
                                value={Math.max(evening, 0)}
                                onChange={setPeriod(index, 'evening')}
                                className={classes.textField}
                                type='number'
                                InputLabelProps={{ shrink: true }}
                                margin='normal'
                                disabled={disabled}
                            />
                            <div className={classes.buttonContainer}>
                                {getButton('删除', <RemoveIcon />, deleteDate(index))}
                            </div>
                        </div>
                    ))}
                </div>
            </AccordionDetails>
            <AccordionActions classes={{ root: classes.expansionActions }}>
                <div className={classes.buttonContainer}>
                    {!!allocation.length && getButton('提交', <CheckIcon />, submit)}
                    {!!allocation.length && getButton('取消', <CancelIcon />, cancel)}
                    {getButton('增加', <AddIcon />, addDate)}
                </div>
            </AccordionActions>
        </Accordion>
    );
});

export default Allocation;
