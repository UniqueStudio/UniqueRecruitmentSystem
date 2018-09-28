export default function mergeKV<T>(k: (string | number | symbol)[], v: T[]) {
    return v.reduce((obj, value, index) => ({ ...obj, [k[index]]: value }), {})
};