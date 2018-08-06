

export const interviewTimer = (slots: number[]) => {

    let selections = [...new Array(30)].map(() => {
        const selects: number[] = [];
        [...new Array(6)].map((j, k) => {
            if (Math.random() > 0.3) selects.push(k)
        });
        if (selects.length === 0) selects.push(Math.floor(Math.random() * 6));
        return { name: 'aaa', select: selects, slot: -1 }
    });

    let result: object[] = [];

    const findFromMax = () => {
        while (selections.map(i => i.slot).filter(i => i === -1).length) {
            let maxLength = -Infinity;
            let maxItems: any[] = [];
            for (const i of selections) {
                if (i.select.length > maxLength) {
                    maxLength = i.select.length;
                    maxItems = [i];
                } else if (i.select.length === maxLength) {
                    maxItems.push(i);
                }
            }
            selections = selections.filter(i => !maxItems.includes(i));
            for (const i of maxItems) {
                let maxSlot = i.select[0];
                for (const j of i.select) {
                    if (slots[j] > slots[maxSlot]) {
                        maxSlot = j;
                    }
                }
                if (slots[maxSlot] === 0) {
                    continue;
                }
                i.slot = maxSlot;
                slots[maxSlot] -= 1;
            }
            result = [...result, ...maxItems];
        }
    };
    const findFromMin = () => {
        while (selections.map(i => i.slot).filter(i => i === -1).length) {
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
                    i.slot = j;
                    hasPlaced = true;
                }
            }
            result = [...result, ...minItems];
        }
    };
    0 && findFromMax();
    findFromMin();
    return result;
};
