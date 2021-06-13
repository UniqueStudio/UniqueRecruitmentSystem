import { promises } from 'fs';
import { dirname } from 'path';

export const listDir = async (directory: string) => {
    return await promises.readdir(directory);
};

export const copyFile = async (from: string, to: string) => {
    await promises.mkdir(dirname(to), { recursive: true });
    await promises.copyFile(from, to);
};

export const deleteFile = (path: string) => promises.unlink(path);
