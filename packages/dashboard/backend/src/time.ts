const interviewTimer = (slots: number[]) => {
    let selections = [...new Array(20)].map(i => {
        const selects: number[] = [];
        [...new Array(6)].map((j, k) => {
            if (Math.random() > 0.3) selects.push(k)
        });
        if (selects.length === 0) selects.push(Math.floor(Math.random() * 6));
        return { name: 'aaa', select: selects, slot: -1 }
    });

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
    }
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
    result[interviewTimer([3, 5, 3, 3, 3, 3]).filter(i => i >= 0).reduce((i, j) => i + j)] += 1;
}
console.log(result);