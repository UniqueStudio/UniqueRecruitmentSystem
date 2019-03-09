import moment from 'moment';
import { Candidate, Time } from '../config/types';

const padZero = (toPad: number) => toPad.toString().padStart(2, '0');

const getDate = (timestamp: number) => {
    const date = moment(timestamp).utcOffset(8);
    return `${padZero(date.year())}-${padZero(date.month() + 1)}-${padZero(date.date())}`;
};

export const allocateTime = (interviewTime: Time[], candidates: Candidate[], type: 'group' | 'team') => {

    const timeSlots = {
        morning: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '08:00', '08:30'],
        afternoon: ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '13:30', '14:00'],
        evening: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
    };

    let selections = candidates.map(({ interviews: { [type]: { selection } }, _id }) => ({ selection, id: _id }));
    const slots = interviewTime.map(({ date, evening, afternoon, morning }) => ({
        date,
        evening: [...timeSlots.evening].slice(0, evening),
        afternoon: [...timeSlots.afternoon].slice(0, afternoon),
        morning: [...timeSlots.morning].slice(0, morning),
    }));

    const allocations = [] as { id: string, time?: number }[];

    while (selections.length) {
        let minLength = Infinity;
        let minItems = [] as typeof selections;
        selections = selections.filter((selection) => {
            const lengthInDates = selection.selection.map(({ morning, afternoon, evening }) =>
                (morning ? 1 : 0) + (afternoon ? 1 : 0) + (evening ? 1 : 0)
            );
            const length = lengthInDates.reduce((i, j) => i + j);
            if (length < minLength) {
                minLength = length;
                minItems = [selection];
                return false;
            } else if (length === minLength) {
                minItems.push(selection);
                return false;
            }
            return true;
        });
        for (const selection of minItems) {
            let hasPlaced = false;
            for (const item of selection.selection) {
                if (hasPlaced) {
                    break;
                }
                const slotTime = slots.find(({ date }) => getDate(date) === getDate(item.date));
                if (!slotTime) {
                    throw new Error('Candidate selected a not exist time!');
                }
                if (!slotTime.evening.length && !slotTime.morning.length && !slotTime.afternoon.length) {
                    continue;
                }
                let time;
                if (item.morning && slotTime.morning.length) {
                    time = slotTime.morning.shift();
                } else if (item.afternoon && slotTime.afternoon.length) {
                    time = slotTime.afternoon.shift();
                } else if (item.evening && slotTime.evening.length) {
                    time = slotTime.evening.shift();
                }
                if (!time) {
                    continue;
                }
                allocations.push({
                    id: selection.id,
                    time: moment(`${getDate(item.date)}T${time}+08:00`).valueOf()
                });
                hasPlaced = true;
            }
            if (!hasPlaced) {
                allocations.push({
                    id: selection.id,
                    time: undefined
                });
            }
        }
    }
    return allocations;
};
