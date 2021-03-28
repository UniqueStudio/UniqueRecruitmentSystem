// /^\d{4}[ASC]$/, 'S' > 'C' > 'A'
export const compareJoinTime = (a: string, b: string) => {
    if (a.slice(0, 4) < b.slice(0, 4)) {
        return -1;
    }
    if (a.slice(0, 4) > b.slice(0, 4)) {
        return 1;
    }
    if (a.slice(4) > b.slice(4)) {
        return -1;
    }
    if (a.slice(4) < b.slice(4)) {
        return 1;
    }
    return 0;
};
