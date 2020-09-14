import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { promisify } from 'util';

const copy = promisify(fs.copyFile);
const mkdir = promisify(mkdirp);

export const copyFile = async (oldPath: string, newDirectory: string, name: string) => {
    await mkdir(newDirectory);
    const newPath = join(newDirectory, name);
    await copy(oldPath, newPath);
    return newPath;
};
