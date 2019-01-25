export const errorRes = (message: string, type: string, data?: object) => ({
    message,
    type,
    data
});
