import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { promisify } from 'util';

const rename = promisify(fs.rename);
const mkdir = promisify(mkdirp);

export const moveFile = async (oldPath: string, newDirectory: string, name: string) => {
    await mkdir(newDirectory);
    const newPath = join(newDirectory, name);
    await rename(oldPath, newPath);
};
