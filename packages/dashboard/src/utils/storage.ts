import { Candidate, Recruitment, User } from '../config/types';

interface LocalStorageRecord extends Record<string, unknown> {
    token: string;
    candidates: Candidate[];
    viewing: string;
    user: User;
    group: User[];
    recruitments: Recruitment[];
}

type StringKeyOf<T> = Extract<keyof T, string>;

const stringify = <T>(data: T) => (typeof data === 'string' ? data : JSON.stringify(data));

export class TypedStorage<T extends Record<string, unknown>> {
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    get length() {
        return this.storage.length;
    }

    // clear storage, except field "token"
    clear() {
        const token = this.storage.getItem('token');
        this.storage.clear();
        token && this.storage.setItem('token', token);
    }

    // clear storage
    clearAll() {
        this.storage.clear();
    }

    getItem<K extends StringKeyOf<T>>(key: K): T[K] | null {
        const item = this.storage.getItem(key);
        try {
            return item ? (JSON.parse(item) as T[K]) : null;
        } catch (e) {
            return (item as unknown) as T[K];
        }
    }

    key(index: number) {
        return this.storage.key(index) as StringKeyOf<T> | null;
    }

    removeItem(key: StringKeyOf<T>): void {
        this.storage.removeItem(key);
    }

    setItem<K extends StringKeyOf<T>>(key: K, value: T[K]) {
        this.storage.setItem(key, stringify(value));
    }
}

// export const sessionStorage = new TypedStorage<SessionStorageRecord>(globalThis.sessionStorage);
export const localStorage = new TypedStorage<LocalStorageRecord>(globalThis.localStorage);

export const updateStorage = <K extends StringKeyOf<LocalStorageRecord>>(name: K) => (data: LocalStorageRecord[K]) =>
    localStorage.setItem(name, data);
