import { promises } from 'fs';
import { join } from 'path';

export const copyFile = async (from: string, toDirectory: string, toName: string) => {
    await promises.mkdir(toDirectory, {
        recursive: true,
    });
    await promises.copyFile(from, join(toDirectory, toName));
};

export const deleteFile = (directory: string, name: string) => promises.unlink(join(directory, name));
