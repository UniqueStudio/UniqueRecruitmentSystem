import { IconButton, MenuItem, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import { DatePicker } from '@material-ui/pickers';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';

import { setRecruitmentInterviews } from '@apis/rest';
import { PERIOD_MAP } from '@config/consts';
import { GroupOrTeam, Period, StepType } from '@config/enums';
import { Interview } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/slots';
import { roundToDay } from '@utils/time';

interface Props {
    name: string;
    onClick: () => void;
    disabled?: boolean;
}

const TipButton: FC<Props> = ({ name, onClick, disabled, children }) => (
    <Tooltip title={name}>
        <IconButton onClick={onClick} color='primary' disabled={disabled} size='small'>
            {children}
        </IconButton>
    </Tooltip>
);

export const Slots: FC = observer(() => {
    const classes = useStyles();
    const { $recruitment, $candidate, $user } = useStores();
    const [slots, setSlots] = useState<Omit<Interview, 'name' | 'id'>[]>([]);

    const init = () => {
        const recruitment = $recruitment.viewingRecruitment;
        if (!recruitment) {
            return;
        }
        const { interviews } = recruitment;
        setSlots(
            interviews
                .filter(({ name }) =>
                    $candidate.stepType === StepType.teamInterview
                        ? name === GroupOrTeam.unique
                        : name === GroupOrTeam[$candidate.group],
                )
                .map((i) => toJS(i)),
        );
    };

    useEffect(init, [$recruitment.viewingRecruitment, $candidate.stepType, $candidate.group]);

    const addSlot = () => {
        setSlots((prevSlots) => [
            ...prevSlots,
            {
                period: Period.morning,
                date: roundToDay(new Date()),
                slotNumber: 1,
            },
        ]);
    };

    const deleteSlot = (index: number) => () => {
        setSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
    };

    const setDate = (index: number) => (date: Date | null) => {
        if (!date) {
            return;
        }
        setSlots((prevSlots) => [
            ...prevSlots.slice(0, index),
            { ...prevSlots[index], date: roundToDay(date) },
            ...prevSlots.slice(index + 1),
        ]);
    };

    const setPeriod = (index: number): ChangeEventHandler<HTMLInputElement> => ({ target }) => {
        setSlots((prevSlots) => [
            ...prevSlots.slice(0, index),
            { ...prevSlots[index], period: +target.value as Period },
            ...prevSlots.slice(index + 1),
        ]);
    };

    const setSlotNumber = (index: number): ChangeEventHandler<HTMLInputElement> => ({ target }) => {
        setSlots((prevSlots) => [
            ...prevSlots.slice(0, index),
            { ...prevSlots[index], slotNumber: Math.max(+target.value, 1) },
            ...prevSlots.slice(index + 1),
        ]);
    };

    const submit = () =>
        setRecruitmentInterviews(
            $recruitment.viewingId,
            $candidate.stepType === StepType.teamInterview ? GroupOrTeam.unique : GroupOrTeam[$candidate.group],
            slots,
        );

    return (
        <>
            <div className={classes.container}>
                {slots.map(({ period, date, slotNumber }, index) => (
                    <div key={index} className={classes.slotContainer}>
                        <DatePicker
                            label='日期'
                            value={date}
                            onChange={setDate(index)}
                            format='yyyy/MM/dd'
                            margin='normal'
                            className={classes.dateTextField}
                        />
                        <TextField
                            select
                            label='时间段'
                            value={period}
                            InputLabelProps={{ shrink: true }}
                            onChange={setPeriod(index)}
                            margin='normal'>
                            {[...PERIOD_MAP.entries()].map(([value, item]) => (
                                <MenuItem value={value} key={value}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label='人数'
                            value={slotNumber}
                            onChange={setSlotNumber(index)}
                            type='number'
                            InputLabelProps={{ shrink: true }}
                            margin='normal'
                            className={classes.numberTextField}
                        />
                        <TipButton name='删除' onClick={deleteSlot(index)}>
                            <RemoveIcon />
                        </TipButton>
                    </div>
                ))}
            </div>
            <div>
                <TipButton name='提交' onClick={submit} disabled={!$user.isAdminOrCaptain}>
                    <CheckIcon />
                </TipButton>
                <TipButton name='取消' onClick={init}>
                    <CancelIcon />
                </TipButton>
                <TipButton name='增加' onClick={addSlot}>
                    <AddIcon />
                </TipButton>
            </div>
        </>
    );
});
