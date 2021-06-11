import { ObjectStorage, PrimitiveStorage } from '@uniqs/utils';
import * as idb from 'idb-keyval';

export const primitiveStorage = new PrimitiveStorage<{
    token: string;
}>(import.meta.env.SSR ? {} as Storage : localStorage);

export const objectStorage = new ObjectStorage<{
}>(idb);
