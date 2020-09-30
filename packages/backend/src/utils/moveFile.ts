import fs from 'fs';
import mkdirp from 'mkdirp';
import { join } from 'path';
import { promisify } from 'util';

const mv = promisify(fs.rename);

export const moveFile = async (oldPath: string, newDirectory: string, name: string) => {
    mkdirp.sync(newDirectory);
    const newPath = join(newDirectory, name);
    await mv(oldPath, newPath);
    return newPath;
};
