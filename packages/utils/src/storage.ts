import * as idb from 'idb-keyval';

/*
 * Both `IndexedDB` and `LocalStorage` are used in our dashboard.
 * Objects are stored in `IndexedDB`, while primitives are stored in `LocalStorage`.
 */

export class PrimitiveStorage<T extends Record<string, unknown>> {
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    get<K extends string & keyof T>(key: K) {
        const value = this.storage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value) as T[K];
            } catch {}
        }
        return undefined;
    }

    set<K extends string & keyof T>(key: K, value: T[K]) {
        return this.storage.setItem(key, JSON.stringify(value));
    }

    del<K extends string & keyof T>(key: K) {
        return this.storage.removeItem(key);
    }

    clear() {
        return this.storage.clear();
    }
}

export class ObjectStorage<T extends Record<string, unknown>> {
    private storage: typeof idb;

    constructor(storage: typeof idb) {
        this.storage = storage;
    }

    get<K extends string & keyof T>(key: K) {
        return this.storage.get<T[K]>(key);
    }

    set<K extends string & keyof T>(key: K, value: T[K]) {
        return this.storage.set(key, value);
    }

    del<K extends string & keyof T>(key: K) {
        return this.storage.del(key);
    }

    clear() {
        return this.storage.clear();
    }
}
