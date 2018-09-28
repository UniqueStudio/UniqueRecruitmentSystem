import { Candidate } from './consts';

const converter = (selections: object[]) => {
    const result: number[] = [];
    selections.map((i, j) => {
        i['morning'] && result.push(j * 3);
        i['afternoon'] && result.push(j * 3 + 1);
        i['evening'] && result.push(j * 3 + 2);
    });
    return result;
};

export const arrangeTime = (slots: number[], candidates: Candidate[], interview: 1 | 2, dates: string[]) => {

    const timeSlots = {
        morning: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
        afternoon: ['13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
        evening: ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']
    };

    let time = {};
    dates.map(i => {
        time[i] = timeSlots;
    });

    let result: object[] = [];
    let selections = candidates.map(i => {
        if (!i[`time${interview}`]) {
            throw new Error('有选手未选择时间！');
        }
        return {
            _id: i._id,
            select: converter(i[`time${interview}`]),
            [`slot${interview}`]: i[`slot${interview}`],
            date: i[`time${interview}`].map((i: object) => i['date'])
        }
    });

    const findFromMin = () => {
        while (selections.map(i => i[`slot${interview}`]).filter(i => i === undefined).length) {
            let minLength = Infinity;
            let minItems: any[] = [];
            for (const i of selections) {
                if (i.select.length < minLength) {
                    minLength = i.select.length;
                    minItems = [i];
                } else if (i.select.length === minLength) {
                    minItems.push(i);
                }
            }
            selections = selections.filter(i => !minItems.includes(i));
            for (const i of minItems) {
                let hasPlaced = false;
                for (const j of i.select) {
                    if (hasPlaced) {
                        break;
                    }
                    if (slots[j] <= 0) {
                        continue;
                    }
                    slots[j] -= 1;
                    i[`slot${interview}`] = [
                        i.date[~~(j / 3)],
                        ['morning', 'afternoon', 'evening'][j % 3],
                        time[i.date[~~(j / 3)]][['morning', 'afternoon', 'evening'][j % 3]].splice(0, 1)[0] || ''
                    ];
                    hasPlaced = true;
                }
            }
            result = [...result, ...minItems];
        }
    };
    findFromMin();
    return result;
};
