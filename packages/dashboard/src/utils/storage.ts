import { Candidate, Group, Recruitment, User } from '../config/types';

interface SessionStorageRecord {
    candidates: Candidate[];
    viewing: string;
    user: Partial<User>;
    group: User[];
    recruitments: Recruitment[];
}

interface LocalStorageRecord {
    token: string;
    group: Group;
}

type StringKeyOf<T> = Extract<keyof T, string>;

const stringify = (data: any) => (typeof data === 'string' ? data : JSON.stringify(data));

export class TypedStorage<T extends Record<string, any>> {
    private storage: Storage;
    constructor(storage: Storage) {
        this.storage = storage;
    }
    get length() {
        return this.storage.length;
    }
    clear() {
        this.storage.clear();
    }
    getItem<K extends StringKeyOf<T>>(key: K): T[K] | null {
        const item = this.storage.getItem(key);
        try {
            return item ? JSON.parse(item) : null;
        } catch (e) {
            // @ts-ignore
            return item;
        }
    }
    key(index: number): StringKeyOf<T> | null {
        return this.storage.key(index) as any;
    }
    removeItem(key: StringKeyOf<T>): void {
        this.storage.removeItem(key);
    }
    setItem<K extends StringKeyOf<T>>(key: K, value: T[K]) {
        this.storage.setItem(key, stringify(value));
    }
}

export const sessionStorage = new TypedStorage<SessionStorageRecord>(globalThis.sessionStorage);

export const localStorage = new TypedStorage<LocalStorageRecord>(globalThis.localStorage);

export const updateStorage = <K extends StringKeyOf<SessionStorageRecord>>(name: K) => (
    data: SessionStorageRecord[K],
) => sessionStorage.setItem(name, data);
