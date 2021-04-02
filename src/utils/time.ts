export const roundToMinute = (date: Date) => {
    const newDate = new Date(date);
    newDate.setSeconds(0, 0);
    return newDate;
};

export const roundToDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
