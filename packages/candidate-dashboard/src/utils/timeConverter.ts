export const convertToDate = (time: number) => {
    const d = new Date(time);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};
