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
