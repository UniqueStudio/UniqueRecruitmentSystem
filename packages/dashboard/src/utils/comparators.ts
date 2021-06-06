export const compareTitle = (prev: string, next: string) => {
    if (prev.slice(0, 4) < next.slice(0, 4)) {
        return -1;
    }
    if (prev.slice(0, 4) > next.slice(0, 4)) {
        return 1;
    }
    if (prev.slice(4) > next.slice(4)) {
        // 'S' > 'C' > 'A'
        return -1;
    }
    if (prev.slice(4) < next.slice(4)) {
        // 'S' > 'C' > 'A'
        return 1;
    }
    return 0;
};

export const compareAllocation = (a?: Date, b?: Date) => {
    return a ? b ? +a - +b : -1 : b ? 1 : 0;
};
