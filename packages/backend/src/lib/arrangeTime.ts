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

export const arrangeTime = (slots: number[], candidates: Candidate[], interview: 1 | 2) => {

    let result: object[] = [];
    let selections = candidates.map(i => ({
        _id: i._id,
        select: converter(i[`time${interview}`]),
        [`slot${interview}`]: i[`slot${interview}`]
    }));

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
                    i[`slot${interview}`] = j;
                    hasPlaced = true;
                }
            }
            result = [...result, ...minItems];
        }
    };
    findFromMin();
    return result;
};
