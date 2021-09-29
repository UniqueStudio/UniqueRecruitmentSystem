import { IconButton, MenuItem, TextField, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import CancelIcon from '@material-ui/icons/CancelOutlined';
import CheckIcon from '@material-ui/icons/CheckCircleOutlined';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import { MobileDatePicker } from '@material-ui/lab';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { ChangeEventHandler, FC, useEffect, useState } from 'react';

import { setRecruitmentInterviews } from '@apis/rest';
import { PERIOD_MAP } from '@config/consts';
import { GroupOrTeam, Period, StepType } from '@config/enums';
import { Interview } from '@config/types';
import { useStores } from '@hooks/useStores';
import useStyles from '@styles/slots';
import { roundToDay } from '@uniqs/utils';

interface Props {
    name: string;
    onClick: () => void;
    disabled?: boolean;
}

const TipButton: FC<Props> = ({ name, onClick, disabled, children }) => (
    <Tooltip title={name}>
        <IconButton onClick={onClick} color='primary' disabled={disabled}>
            {children}
        </IconButton>
    </Tooltip>
);

export const Slots: FC = observer(() => {
    const classes = useStyles();
    const { $recruitment, $application, $member } = useStores();
    const [slots, setSlots] = useState<Pick<Interview, 'date' | 'period' | 'slotNumber'>[]>([]);

    const init = () => {
        const interviews = $recruitment.viewingRecruitment?.interviews ?? [];
        setSlots(
            interviews
                .filter(({ name }) =>
                    $application.stepType === StepType.teamInterview
                        ? name === GroupOrTeam.unique
                        : name === GroupOrTeam[$application.group],
                )
                .map((i) => toJS(i)),
        );
    };

    useEffect(init, [$recruitment.viewingRecruitment?.interviews, $application.stepType, $application.group]);

    const addSlot = () => {
        setSlots((prevSlots) => [
            ...prevSlots,
            {
                period: Period.morning,
                date: roundToDay(new Date()).toJSON(),
                slotNumber: 1,
            },
        ]);
    };

    const deleteSlot = (index: number) => () => {
        setSlots((prevSlots) => prevSlots.filter((_, i) => i !== index));
    };

    const setDate = (index: number) => (date: unknown) => {
        if (!(date instanceof Date)) {
            return;
        }
        setSlots((prevSlots) => [
            ...prevSlots.slice(0, index),
            { ...prevSlots[index], date: roundToDay(date).toJSON() },
            ...prevSlots.slice(index + 1),
        ]);
    };

    const setPeriod =
        (index: number): ChangeEventHandler<HTMLInputElement> =>
        ({ target }) =>
            setSlots((prevSlots) => [
                ...prevSlots.slice(0, index),
                { ...prevSlots[index], period: +target.value as Period },
                ...prevSlots.slice(index + 1),
            ]);

    const setSlotNumber =
        (index: number): ChangeEventHandler<HTMLInputElement> =>
        ({ target }) =>
            setSlots((prevSlots) => [
                ...prevSlots.slice(0, index),
                { ...prevSlots[index], slotNumber: Math.max(+target.value, 1) },
                ...prevSlots.slice(index + 1),
            ]);

    const submit = () =>
        setRecruitmentInterviews(
            $recruitment.viewingId,
            $application.stepType === StepType.teamInterview ? GroupOrTeam.unique : GroupOrTeam[$application.group],
            slots,
        );

    return (
        <>
            <div className={classes.container}>
                {slots.map(({ period, date, slotNumber }, index) => (
                    <div key={index} className={classes.slotContainer}>
                        <MobileDatePicker
                            label='日期'
                            value={date}
                            onChange={setDate(index)}
                            renderInput={(props) => (
                                <TextField {...props} variant='standard' className={classes.dateTextField} />
                            )}
                        />
                        <TextField
                            variant='standard'
                            select
                            label='时间段'
                            value={period}
                            InputLabelProps={{ shrink: true }}
                            onChange={setPeriod(index)}
                            margin='normal'
                        >
                            {[...PERIOD_MAP.entries()].map(([value, item]) => (
                                <MenuItem value={value} key={value}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            variant='standard'
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
            <div className={classes.buttonsContainer}>
                <TipButton name='提交' onClick={submit} disabled={!$member.isAdminOrCaptain}>
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
