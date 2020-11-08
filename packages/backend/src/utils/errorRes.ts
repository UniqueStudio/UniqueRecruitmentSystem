export const errorRes = (message: string, type: string, data?: Record<string, unknown>) => ({
    message,
    type,
    data,
});
