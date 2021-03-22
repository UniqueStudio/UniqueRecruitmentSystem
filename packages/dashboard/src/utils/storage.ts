/*
 * There are two storages in our dashboard, the first is IndexedDB and the second is LocalStorage.
 * To avoid (manual) serialization, objects are stored in IDB and plain strings are stored in LocalStorage.
 */

interface LocalStorageRecord {
    token: string;
    viewing: string;
}

export class TypedStorage<T extends string> {
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

    getItem(key: T) {
        return this.storage.getItem(key);
    }

    key(index: number) {
        return this.storage.key(index) as T | null;
    }

    removeItem(key: T): void {
        this.storage.removeItem(key);
    }

    setItem(key: T, value: string) {
        this.storage.setItem(key, value);
    }
}

export const localStorage = new TypedStorage<keyof LocalStorageRecord>(globalThis.localStorage);
