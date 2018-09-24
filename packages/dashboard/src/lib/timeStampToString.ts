export default (time: number, end: number = 10) =>
    new Date(time - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, end)
