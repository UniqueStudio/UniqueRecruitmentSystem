export const roundToMinute = (date: Date) => {
    const newDate = new Date(date);
    newDate.setSeconds(0, 0);
    return newDate;
};

/*
 * TODO: `roundToDay` is based on the assumption that
 * the timezone of all the users(candidates/members) is UTC+8,
 * which may causes some unexpected bugs when they live in other timezones.
 */
export const roundToDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};
