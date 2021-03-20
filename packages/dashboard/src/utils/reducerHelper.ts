export const insertItem = <T>(array: T[], index: number, item: T) => [
    ...array.slice(0, index),
    item,
    ...array.slice(index),
];

export const removeItem = <T>(array: T[], index: number) => [...array.slice(0, index), ...array.slice(index + 1)];

export const updateObjectInArray = <T>(array: T[], index: number, item: Partial<T>) =>
    array.map((element, i) => {
        if (i !== index) {
            return element;
        }
        return {
            ...element,
            ...item,
        };
    });

export const stableSort = <T>(array: T[], comparator: (a: T, b: T) => number) => {
    const stabilizedThis = array.map((el, index) => ({ el, index }));
    stabilizedThis.sort((a, b) => {
        const order = comparator(a.el, b.el);
        if (order !== 0) {
            return order;
        }
        return a.index - b.index;
    });
    return stabilizedThis.map((el) => el.el);
};
