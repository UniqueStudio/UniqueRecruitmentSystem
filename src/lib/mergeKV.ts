export default function merged<T>(k: (string | number | symbol)[], v: T[]) {
    return v.reduce((acc, curr, index) => ({ ...acc, [k[index]]: curr }), {});
}
