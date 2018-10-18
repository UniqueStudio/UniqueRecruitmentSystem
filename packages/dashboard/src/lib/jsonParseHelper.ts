export default function jsonParser<T>(str: string | null, fallback: T) {
    return str ? JSON.parse(str) : fallback;
}
