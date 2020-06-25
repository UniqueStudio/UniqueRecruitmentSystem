import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { promisify } from 'util';

const copy = promisify(fs.copyFile);

export const copyFile = async (oldPath: string, newDirectory: string, name: string) => {
    mkdirp.sync(newDirectory);
    const newPath = join(newDirectory, name);
    await copy(oldPath, newPath);
    return newPath;
};
