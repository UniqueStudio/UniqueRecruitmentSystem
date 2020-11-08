import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const copyFile = (oldPath: string, newDirectory: string, name: string) => {
    mkdirSync(newDirectory, { recursive: true });
    const newPath = join(newDirectory, name);
    copyFileSync(oldPath, newPath);
    return newPath;
};
