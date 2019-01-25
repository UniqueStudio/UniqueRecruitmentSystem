export const insertItem = <T>(array: T[], index: number, item: T) => [...array.slice(0, index), item, ...array.slice(index)];

export const removeItem = <T>(array: T[], index: number) => [...array.slice(0, index), ...array.slice(index + 1)];

export const updateObjectInArray = <T>(array: T[], index: number, item: Partial<T>) => array.map((element, i) => {
    if (i !== index) {
        return element;
    }
    return {
        ...element,
        ...item
    };
});
