const merged = (k: any[], v: any[]) => v.reduce((obj, value, index) => ({...obj, [k[index]]: value}), {});

export default merged;