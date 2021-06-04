/*
 * Both `IndexedDB` and `LocalStorage` are used in our dashboard.
 * Objects are stored in `IndexedDB`, while primitives are stored in `LocalStorage`.
 */

class TypedStorage<T extends { [key: string]: unknown }> {
    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    get length() {
        return this.storage.length;
    }

    // clear storage
    clear() {
        this.storage.clear();
    }

    getItem<K extends string & keyof T>(key: K) {
        const value = this.storage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value) as T[K];
            } catch {}
        }
        return undefined;
    }

    key(index: number) {
        return this.storage.key(index);
    }

    removeItem<K extends string & keyof T>(key: K) {
        this.storage.removeItem(key);
    }

    setItem<K extends string & keyof T>(key: K, value: T[K]) {
        this.storage.setItem(key, JSON.stringify(value));
    }
}

class PrimitiveStorage extends TypedStorage<{
    token: string;
    viewingId: string;
    darkMode?: boolean;
}> {
    constructor(storage = globalThis.localStorage) {
        super(storage);
    }

    // clear storage, except field "token"
    clear() {
        const token = this.getItem('token');
        super.clear();
        token && this.setItem('token', token);
    }
}

export const primitiveStorage = new PrimitiveStorage();
