import * as idb from 'idb-keyval';

import { Application, Member, Recruitment } from '@config/types';
import { ObjectStorage, PrimitiveStorage } from '@uniqs/utils';

export const primitiveStorage = new class extends PrimitiveStorage<{
    token: string;
    viewingId: string;
    darkMode?: boolean;
}> {
    constructor(storage = globalThis.localStorage) {
        super(storage);
    }

    // clear storage, except field "token"
    clear() {
        const token = this.get('token');
        super.clear();
        if (token) {
            this.set('token', token);
        }
    }
}();

export const objectStorage = new ObjectStorage<{
    applications: Map<string, Application>;
    recruitments: Map<string, Recruitment>;
    group: Member[];
    member: Member;
}>(idb);
