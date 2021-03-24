import { promises } from 'fs';
import { join } from 'path';

export const copyFile = async (from: string, toDirectory: string, toName: string) => {
    await promises.mkdir(toDirectory, {
        recursive: true,
    });
    const to = join(toDirectory, toName);
    await promises.copyFile(from, to);
    return to;
};
