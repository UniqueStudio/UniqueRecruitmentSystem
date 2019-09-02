interface SizeSwitchObj {
    [propName: number]: boolean;
}

export const sizeSwitch = (obj: SizeSwitchObj) => {
    let size: number = 1;
    for (const [k, v] of Object.entries(obj)) {
        if (v) {
            size = Number.parseInt(k, 10);
            break;
        }
    }
    return size;
};
