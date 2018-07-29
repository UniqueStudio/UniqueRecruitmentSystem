const interviewTimer = (slots: number[]) => {
    let selections = [...new Array(30)].map(() => {
        const selects: number[] = [];
        [...new Array(6)].map((j, k) => {
            if (Math.random() > 0.3) selects.push(k)
        });
        if (selects.length === 0) selects.push(Math.floor(Math.random() * 6));
        return { name: 'aaa', select: selects, slot: -1 }
    });
    let maxResult: object[] = [];
    let minResult: object[] = [];
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
                i.slot = maxSlot;
                slots[maxSlot] -= 1;
            }
            maxResult = [...maxResult, ...maxItems];
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
            minResult = [...minResult, ...minItems];
        }
    };
    0 && findFromMax();
    findFromMin();
    return slots;
};

const result = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
};
for (let t = 0; t < 300000; t++) {
    result[interviewTimer([4, 5, 6, 4, 5, 6]).filter(i => i >= 0).reduce((i, j) => i + j)] += 1;
}
console.log(result);
