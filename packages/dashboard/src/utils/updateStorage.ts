export const updateStorage = (name: string) => (data: string | object) =>
    sessionStorage.setItem(name, typeof data === 'string' ? data : JSON.stringify(data));
